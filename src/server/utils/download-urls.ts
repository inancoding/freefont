const GITHUB_OWNER = process.env.GITHUB_OWNER || 'inancoding';
const GITHUB_REPO = process.env.GITHUB_REPO || 'freefont';
const RELEASES_BRANCH = 'releases';

const OVERSIZED_SLUGS = new Set(['source-han-seri']);

export function computeDownloadUrls(slug: string, version: string, cloudDriveUrl?: string | null) {
  const artifact = `${slug}-${version}.zip`;

  if (OVERSIZED_SLUGS.has(slug)) {
    const tag = `${slug}-v${version}`;
    const releaseUrl = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/download/${tag}/${artifact}`;
    return {
      githubRaw: releaseUrl,
      jsdelivr: releaseUrl,
      ghproxy: releaseUrl,
      ...(cloudDriveUrl ? { cloudDrive: cloudDriveUrl } : {}),
    };
  }

  const path = `${slug}/${artifact}`;
  const rawUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${RELEASES_BRANCH}/${path}`;
  return {
    githubRaw: rawUrl,
    jsdelivr: `https://cdn.jsdelivr.net/gh/${GITHUB_OWNER}/${GITHUB_REPO}@${RELEASES_BRANCH}/${path}`,
    ghproxy: `https://ghproxy.com/${rawUrl}`,
    ...(cloudDriveUrl ? { cloudDrive: cloudDriveUrl } : {}),
  };
}
