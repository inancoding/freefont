import { Octokit } from '@octokit/rest';
import { readFileSync } from 'node:fs';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'inancoding';
const GITHUB_REPO = process.env.GITHUB_REPO || 'freefont';
const RELEASES_BRANCH = 'releases';

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

export async function uploadZipToGithub(filePath: string, slug: string, version: string) {
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

export async function deleteZipFromGithub(slug: string, version: string) {
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
