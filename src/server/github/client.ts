import { Octokit } from '@octokit/rest';
import { readFileSync, statSync } from 'node:fs';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'inancoding';
const GITHUB_REPO = process.env.GITHUB_REPO || 'freefont';
const RELEASES_BRANCH = 'releases';
const GITHUB_CONTENT_LIMIT = 100 * 1024 * 1024;

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function ensureReleasesBranch() {
  try {
    await octokit.repos.getBranch({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      branch: RELEASES_BRANCH,
    });
  } catch {
    const { data: mainRef } = await octokit.git.getRef({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      ref: 'heads/main',
    });
    await octokit.git.createRef({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      ref: `refs/heads/${RELEASES_BRANCH}`,
      sha: mainRef.object.sha,
    });
  }
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
  if (fileSize > GITHUB_CONTENT_LIMIT) {
    await uploadOversizedReleaseAsset(filePath, slug, version);
    return;
  }

  const filename = `${slug}-${version}.zip`;
  const path = `${slug}/${filename}`;
  const content = readFileSync(filePath);
  const base64 = content.toString('base64');

  await ensureReleasesBranch();

  let sha: string | undefined;
  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
      ref: RELEASES_BRANCH,
    });
    if (!Array.isArray(data) && data.sha) {
      sha = data.sha;
    }
  } catch {
    // File doesn't exist yet
  }

  const params: Record<string, unknown> = {
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path,
    message: `Upload ${slug} v${version}`,
    content: base64,
    branch: RELEASES_BRANCH,
  };
  if (sha) params.sha = sha;

  await octokit.repos.createOrUpdateFileContents(params as any);
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
