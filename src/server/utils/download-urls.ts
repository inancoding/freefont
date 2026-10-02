const GITHUB_OWNER = process.env.GITHUB_OWNER || 'inancoding';
const GITHUB_REPO = process.env.GITHUB_REPO || 'freefont';
const RELEASES_BRANCH = 'releases';

export function computeDownloadUrls(slug: string, version: string, cloudDriveUrl?: string | null) {
  const artifact = `${slug}-${version}.zip`;
  const path = `${slug}/${artifact}`;
  return {
    githubRaw: `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${RELEASES_BRANCH}/${path}`,
    jsdelivr: `https://cdn.jsdelivr.net/gh/${GITHUB_OWNER}/${GITHUB_REPO}@${RELEASES_BRANCH}/${path}`,
    githack: `https://raw.githack.com/${GITHUB_OWNER}/${GITHUB_REPO}/${RELEASES_BRANCH}/${path}`,
    ...(cloudDriveUrl ? { cloudDrive: cloudDriveUrl } : {}),
  };
}
