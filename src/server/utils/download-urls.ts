const GITHUB_OWNER = process.env.GITHUB_OWNER || 'inancoding';
const GITHUB_REPO = process.env.GITHUB_REPO || 'freefont';
const RELEASES_BRANCH = 'releases';

const JSDELIVR_LIMIT = 20 * 1024 * 1024;

// downloadUrl is the canonical GitHub URL stored on the font record:
//   - Release Asset  -> https://github.com/{owner}/{repo}/releases/download/{tag}/{artifact}
//   - releases branch -> https://raw.githubusercontent.com/{owner}/{repo}/releases/{slug}/{artifact}
// Download links are generated from wherever the file actually lives, so legacy
// branch-stored fonts keep working while new asset uploads get the asset URL.
export function computeDownloadUrls(
  slug: string,
  version: string,
  fileSize?: number | null,
  cloudDriveUrl?: string | null,
  downloadUrl?: string | null,
) {
  const artifact = `${slug}-${version}.zip`;
  const cloud = cloudDriveUrl ? { cloudDrive: cloudDriveUrl } : {};

  const resolved =
    downloadUrl ||
    `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/download/${slug}-v${version}/${artifact}`;

  // Release Assets cannot be served by jsDelivr, so only the direct URL is offered.
  if (resolved.includes('/releases/download/')) {
    return { githubRaw: resolved, ...cloud };
  }

  // Legacy: file lives on the `releases` git branch and can be mirrored by jsDelivr.
  const path = `${slug}/${artifact}`;
  if (fileSize && fileSize > JSDELIVR_LIMIT) {
    return { githubRaw: resolved, ...cloud };
  }

  return {
    githubRaw: resolved,
    jsdelivr: `https://cdn.jsdelivr.net/gh/${GITHUB_OWNER}/${GITHUB_REPO}@${RELEASES_BRANCH}/${path}`,
    ...cloud,
  };
}
