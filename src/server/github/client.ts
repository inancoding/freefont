import { Octokit } from '@octokit/rest';
import { readFileSync } from 'node:fs';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'inancoding';
const GITHUB_REPO = process.env.GITHUB_REPO || 'freefont';
const RELEASES_BRANCH = 'releases';

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function getOrCreateRelease(tag: string) {
  try {
    const { data } = await octokit.repos.getReleaseByTag({
      owner: GITHUB_OWNER, repo: GITHUB_REPO, tag,
    });
    return data;
  } catch {
    const { data } = await octokit.repos.createRelease({
      owner: GITHUB_OWNER, repo: GITHUB_REPO,
      tag_name: tag, name: tag, draft: false, prerelease: false,
    });
    return data;
  }
}

// Uploads the ZIP as a GitHub Release Asset. Large request bodies to the
// Contents API are blocked by the server's egress path (401 after ~160s), but
// the uploads.github.com asset channel goes through reliably.
export async function uploadZipToGithub(filePath: string, slug: string, version: string) {
  const tag = `${slug}-v${version}`;
  const filename = `${slug}-${version}.zip`;

  const release = await getOrCreateRelease(tag);

  const existing = release.assets.find((a) => a.name === filename);
  if (existing) {
    await octokit.repos.deleteReleaseAsset({
      owner: GITHUB_OWNER, repo: GITHUB_REPO, asset_id: existing.id,
    });
  }

  const content = readFileSync(filePath);
  const { data: asset } = await octokit.repos.uploadReleaseAsset({
    owner: GITHUB_OWNER, repo: GITHUB_REPO,
    release_id: release.id, name: filename, data: content as any,
  });

  return asset.browser_download_url;
}

export async function deleteZipFromGithub(slug: string, version: string, downloadUrl?: string | null) {
  const tag = `${slug}-v${version}`;
  const filename = `${slug}-${version}.zip`;

  // New uploads live as Release Assets.
  if (!downloadUrl || downloadUrl.includes('/releases/download/')) {
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
    return;
  }

  // Legacy uploads live on the `releases` git branch via the Contents API.
  const path = `${slug}/${filename}`;
  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER, repo: GITHUB_REPO, path, ref: RELEASES_BRANCH,
    });
    if (!Array.isArray(data) && data.sha) {
      await octokit.repos.deleteFile({
        owner: GITHUB_OWNER, repo: GITHUB_REPO, path,
        message: `Delete ${slug} v${version}`,
        sha: data.sha, branch: RELEASES_BRANCH,
      });
    }
  } catch {
    // File or branch doesn't exist, ignore
  }
}
