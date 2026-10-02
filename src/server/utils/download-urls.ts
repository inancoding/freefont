const GITHUB_OWNER = process.env.GITHUB_OWNER || 'inancoding';
const GITHUB_REPO = process.env.GITHUB_REPO || 'freefont';
const RELEASES_BRANCH = 'releases';

const JSDELIVR_LIMIT = 20 * 1024 * 1024;
const GITHUB_CONTENT_LIMIT = 100 * 1024 * 1024;

export function computeDownloadUrls(slug: string, version: string, fileSize?: number | null, cloudDriveUrl?: string | null) {
  const artifact = `${slug}-${version}.zip`;
  const cloud = cloudDriveUrl ? { cloudDrive: cloudDriveUrl } : {};

  if (fileSize && fileSize > GITHUB_CONTENT_LIMIT) {
    const tag = `${slug}-v${version}`;
    const releaseUrl = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/download/${tag}/${artifact}`;
    return { githubRaw: releaseUrl, jsdelivr: releaseUrl, ...cloud };
  }

  const path = `${slug}/${artifact}`;
  const githubRaw = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${RELEASES_BRANCH}/${path}`;

  if (fileSize && fileSize > JSDELIVR_LIMIT) {
    return { githubRaw, ...cloud };
  }

  return {
    githubRaw,
    jsdelivr: `https://cdn.jsdelivr.net/gh/${GITHUB_OWNER}/${GITHUB_REPO}@${RELEASES_BRANCH}/${path}`,
    ...cloud,
  };
}
