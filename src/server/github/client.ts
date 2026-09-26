import { Octokit } from '@octokit/rest';
import { readFileSync } from 'node:fs';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'inancoding';
const GITHUB_REPO = process.env.GITHUB_REPO || 'freefont';

const octokit = new Octokit({ auth: GITHUB_TOKEN });

export async function uploadZipToGithub(filePath: string, slug: string, version: string) {
  const tag = `${slug}-v${version}`;
  const filename = `${slug}-${version}.zip`;
  const content = readFileSync(filePath);

  let release;
  try {
    const { data } = await octokit.repos.getReleaseByTag({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      tag,
    });
    release = data;
  } catch {
    const { data } = await octokit.repos.createRelease({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      tag_name: tag,
      name: `${slug} v${version}`,
      body: `Font release: ${slug} v${version}`,
      draft: false,
      prerelease: false,
    });
    release = data;
  }

  const existingAsset = release.assets.find((a) => a.name === filename);
  if (existingAsset) {
    await octokit.repos.deleteReleaseAsset({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      asset_id: existingAsset.id,
    });
  }

  await octokit.repos.uploadReleaseAsset({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    release_id: release.id,
    name: filename,
    data: content as unknown as string,
    headers: {
      'content-type': 'application/zip',
      'content-length': content.length,
    },
  });
}

export async function deleteZipFromGithub(slug: string, version: string) {
  const tag = `${slug}-v${version}`;
  const filename = `${slug}-${version}.zip`;

  try {
    const { data: release } = await octokit.repos.getReleaseByTag({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      tag,
    });

    const asset = release.assets.find((a) => a.name === filename);
    if (asset) {
      await octokit.repos.deleteReleaseAsset({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        asset_id: asset.id,
      });
    }

    if (release.assets.length === 0) {
      await octokit.repos.deleteRelease({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        release_id: release.id,
      });
      await octokit.git.deleteRef({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        ref: `tags/${tag}`,
      });
    }
  } catch {
    // Release might not exist, ignore
  }
}
