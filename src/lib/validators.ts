const URL_PROTOCOLS = new Set(["http:", "https:"]);

export function isValidWebsiteUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return URL_PROTOCOLS.has(parsed.protocol);
  } catch {
    return false;
  }
}

export function isValidPackageName(packageName: string): boolean {
  const pattern = /^(?:[a-z][a-z0-9_]*)(?:\.[a-z][a-z0-9_]*)+$/;
  return pattern.test(packageName);
}

export function isValidVersionName(versionName: string): boolean {
  const pattern = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;
  return pattern.test(versionName);
}

export function isImageMimeType(mimeType?: string): boolean {
  if (!mimeType) return false;
  return mimeType.startsWith("image/");
}
