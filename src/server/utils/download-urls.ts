const GITHUB_OWNER = process.env.GITHUB_OWNER || 'inancoding';
const GITHUB_REPO = process.env.GITHUB_REPO || 'free-font';

export function computeDownloadUrls(slug: string, version: string, cloudDriveUrl?: string | null) {
  const tag = `${slug}-v${version}`;
  const artifact = `${slug}-${version}.zip`;
  return {
    githubRaw: `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${tag}/zips/${artifact}`,
    jsdelivr: `https://cdn.jsdelivr.net/gh/${GITHUB_OWNER}/${GITHUB_REPO}@${tag}/zips/${artifact}`,
    githack: `https://raw.githack.com/${GITHUB_OWNER}/${GITHUB_REPO}/${tag}/zips/${artifact}`,
    ...(cloudDriveUrl ? { cloudDrive: cloudDriveUrl } : {}),
  };
}
