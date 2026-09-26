const GITHUB_OWNER = process.env.GITHUB_OWNER || 'inancoding';
const GITHUB_REPO = process.env.GITHUB_REPO || 'freefont';

export function computeDownloadUrls(slug: string, version: string, cloudDriveUrl?: string | null) {
  const tag = `${slug}-v${version}`;
  const artifact = `${slug}-${version}.zip`;
  return {
    githubRaw: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/download/${tag}/${artifact}`,
    jsdelivr: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/download/${tag}/${artifact}`,
    githack: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/download/${tag}/${artifact}`,
    ...(cloudDriveUrl ? { cloudDrive: cloudDriveUrl } : {}),
  };
}
