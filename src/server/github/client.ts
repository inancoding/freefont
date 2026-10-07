import { Octokit } from '@octokit/rest';
import { readFileSync, statSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'inancoding';
const GITHUB_REPO = process.env.GITHUB_REPO || 'freefont';
const RELEASES_BRANCH = 'releases';
const GITHUB_CONTENT_LIMIT = 100 * 1024 * 1024;

// Persistent shallow clone used to commit ZIPs onto the releases branch via git
// push. The Contents API is unreliable from this server's egress (large bodies
// hang ~160s then 401), but the git smart-HTTP channel to github.com is clean.
// Lives under the app's writable tmp/ dir (the app root's parent may be root-owned).
const WORK_DIR = process.env.RELEASES_WORK_DIR || join(process.cwd(), 'tmp', 'releases-work');

const AUTH_URL = `https://${GITHUB_OWNER}:${GITHUB_TOKEN}@github.com/${GITHUB_OWNER}/${GITHUB_REPO}.git`;
const PLAIN_URL = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}.git`;

const octokit = new Octokit({ auth: GITHUB_TOKEN });
const exec = promisify(execFile);

function sanitize(text: string) {
  return GITHUB_TOKEN ? text.split(GITHUB_TOKEN).join('***') : text;
}

async function git(args: string[]) {
  try {
    return await exec('git', args, { maxBuffer: 32 * 1024 * 1024 });
  } catch (err) {
    const e = err as { stderr?: string; message?: string };
    throw new Error(sanitize(e.stderr || e.message || 'git command failed'));
  }
}

// Serialize uploads so concurrent requests don't corrupt the shared work dir.
let queue: Promise<unknown> = Promise.resolve();
function serialize<T>(fn: () => Promise<T>): Promise<T> {
  const result = queue.then(fn, fn);
  queue = result.catch(() => {});
  return result;
}

const COMMIT_IDENTITY = ['-c', 'user.email=bot@freefont.local', '-c', 'user.name=freefont-bot'];

// Blobless partial clone: fetches commits + trees but NOT existing ZIP blobs, so
// setup is near-instant regardless of how much the releases branch has amassed.
async function ensureRepo() {
  if (existsSync(join(WORK_DIR, '.git'))) {
    try {
      await git(['-C', WORK_DIR, 'rev-parse', '--git-dir']);
      return;
    } catch {
      rmSync(WORK_DIR, { recursive: true, force: true }); // corrupt/partial clone
    }
  }
  mkdirSync(dirname(WORK_DIR), { recursive: true });
  try {
    await git(['clone', '--no-checkout', '--depth', '1', '--filter=blob:none', '--branch', RELEASES_BRANCH, AUTH_URL, WORK_DIR]);
  } catch {
    // releases branch doesn't exist yet — bootstrap an empty one, then clone it.
    rmSync(WORK_DIR, { recursive: true, force: true });
    mkdirSync(WORK_DIR, { recursive: true });
    await git(['-C', WORK_DIR, 'init', '-q']);
    const { stdout: emptyTree } = await git(['-C', WORK_DIR, 'mktree']);
    const { stdout: initCommit } = await git(['-C', WORK_DIR, ...COMMIT_IDENTITY, 'commit-tree', emptyTree.trim(), '-m', 'init releases']);
    await git(['-C', WORK_DIR, 'push', AUTH_URL, `${initCommit.trim()}:refs/heads/${RELEASES_BRANCH}`]);
    rmSync(WORK_DIR, { recursive: true, force: true });
    await git(['clone', '--no-checkout', '--depth', '1', '--filter=blob:none', '--branch', RELEASES_BRANCH, AUTH_URL, WORK_DIR]);
  }
  // Never persist the token in .git/config; pass AUTH_URL per-command instead.
  await git(['-C', WORK_DIR, 'remote', 'set-url', 'origin', PLAIN_URL]);
}

// Builds a commit on top of the releases tip using plumbing only (no checkout),
// so existing ZIPs are never downloaded — we upload just the one new blob.
async function pushToReleasesBranch(filePath: string, slug: string, version: string) {
  await ensureRepo();
  rmSync(join(WORK_DIR, '.git', 'index.lock'), { force: true }); // clear stale lock
  await git(['-C', WORK_DIR, 'fetch', '--depth', '1', '--filter=blob:none', AUTH_URL, RELEASES_BRANCH]);

  const relPath = `${slug}/${slug}-${version}.zip`;
  const { stdout: blobSha } = await git(['-C', WORK_DIR, 'hash-object', '-w', '-t', 'blob', '--', filePath]);

  await git(['-C', WORK_DIR, 'read-tree', 'FETCH_HEAD']);
  await git(['-C', WORK_DIR, 'update-index', '--add', '--cacheinfo', `100644,${blobSha.trim()},${relPath}`]);
  const { stdout: treeSha } = await git(['-C', WORK_DIR, 'write-tree']);
  const { stdout: commitSha } = await git([
    '-C', WORK_DIR, ...COMMIT_IDENTITY,
    'commit-tree', treeSha.trim(), '-p', 'FETCH_HEAD', '-m', `Upload ${slug} v${version}`,
  ]);
  await git(['-C', WORK_DIR, 'push', AUTH_URL, `${commitSha.trim()}:refs/heads/${RELEASES_BRANCH}`]);

  // The pushed commit is only referenced by FETCH_HEAD, so prune the local blob.
  await git(['-C', WORK_DIR, 'gc', '--prune=now', '--quiet']).catch(() => {});
}

async function uploadOversizedReleaseAsset(filePath: string, slug: string, version: string) {
  const tag = `${slug}-v${version}`;
  const filename = `${slug}-${version}.zip`;

  let release;
  try {
    const { data } = await octokit.repos.getReleaseByTag({
      owner: GITHUB_OWNER, repo: GITHUB_REPO, tag,
    });
    release = data;
  } catch {
    const { data } = await octokit.repos.createRelease({
      owner: GITHUB_OWNER, repo: GITHUB_REPO,
      tag_name: tag, name: tag, draft: false, prerelease: false,
    });
    release = data;
  }

  const existing = release.assets.find((a) => a.name === filename);
  if (existing) {
    await octokit.repos.deleteReleaseAsset({
      owner: GITHUB_OWNER, repo: GITHUB_REPO, asset_id: existing.id,
    });
  }

  const content = readFileSync(filePath);
  await octokit.repos.uploadReleaseAsset({
    owner: GITHUB_OWNER, repo: GITHUB_REPO,
    release_id: release.id, name: filename, data: content as any,
  });
}

async function deleteOversizedReleaseAsset(slug: string, version: string) {
  const tag = `${slug}-v${version}`;
  const filename = `${slug}-${version}.zip`;

  try {
    const { data: release } = await octokit.repos.getReleaseByTag({
      owner: GITHUB_OWNER, repo: GITHUB_REPO, tag,
    });
    const asset = release.assets.find((a) => a.name === filename);
    if (asset) {
      await octokit.repos.deleteReleaseAsset({
        owner: GITHUB_OWNER, repo: GITHUB_REPO, asset_id: asset.id,
      });
    }
  } catch {
    // Release doesn't exist, ignore
  }
}

export async function uploadZipToGithub(filePath: string, slug: string, version: string) {
  const fileSize = statSync(filePath).size;
  // GitHub rejects single git blobs over 100MB, so oversized files stay on the
  // Release Assets channel; everything else is committed to the releases branch.
  if (fileSize > GITHUB_CONTENT_LIMIT) {
    await uploadOversizedReleaseAsset(filePath, slug, version);
    return;
  }
  await serialize(() => pushToReleasesBranch(filePath, slug, version));
}

export async function deleteZipFromGithub(slug: string, version: string, fileSize?: number | null) {
  if (fileSize && fileSize > GITHUB_CONTENT_LIMIT) {
    await deleteOversizedReleaseAsset(slug, version);
    return;
  }

  const filename = `${slug}-${version}.zip`;
  const path = `${slug}/${filename}`;

  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
      ref: RELEASES_BRANCH,
    });

    if (!Array.isArray(data) && data.sha) {
      await octokit.repos.deleteFile({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path,
        message: `Delete ${slug} v${version}`,
        sha: data.sha,
        branch: RELEASES_BRANCH,
      });
    }
  } catch {
    // File or branch doesn't exist, ignore
  }
}
