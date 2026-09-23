import { Octokit } from '@octokit/rest';
import { readFileSync } from 'node:fs';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'inancoding';
const GITHUB_REPO = process.env.GITHUB_REPO || 'free-font';

const octokit = new Octokit({ auth: GITHUB_TOKEN });

export async function uploadZipToGithub(filePath: string, slug: string, version: string) {
  const content = readFileSync(filePath);
  const base64Content = content.toString('base64');
  const path = `zips/${slug}-${version}.zip`;
  const message = `Add font: ${slug} v${version}`;

  await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path,
    message,
    content: base64Content,
    branch: 'main',
  });
}

export async function deleteZipFromGithub(slug: string, version: string) {
  const path = `zips/${slug}-${version}.zip`;

  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
      ref: 'main',
    });

    if ('sha' in data) {
      await octokit.repos.deleteFile({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path,
        message: `Remove font: ${slug} v${version}`,
        sha: data.sha,
        branch: 'main',
      });
    }
  } catch {
    // File might not exist, ignore
  }
}
