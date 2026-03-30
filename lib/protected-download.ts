import { head } from '@vercel/blob';

export const internals = {
  headBlob: head,
};

class ProtectedAssetUnavailableError extends Error {
  constructor(pathname: string, cause: unknown) {
    const causeMessage = cause instanceof Error ? `${cause.name}: ${cause.message}` : String(cause);

    super(
      `Protected asset lookup failed for ${pathname}. Cause: ${causeMessage}. Ensure the file exists in Vercel Blob storage and Blob access is configured for this environment.`,
    );
    this.name = 'ProtectedAssetUnavailableError';
  }
}

export async function getProtectedAssetDownloadUrl(pathname: string): Promise<string> {
  let blobMetadata: Awaited<ReturnType<typeof head>>;

  try {
    blobMetadata = await internals.headBlob(pathname);
  } catch (error) {
    throw new ProtectedAssetUnavailableError(pathname, error);
  }

  const downloadUrl = blobMetadata.downloadUrl?.trim();

  if (!downloadUrl) {
    throw new ProtectedAssetUnavailableError(pathname, 'Vercel Blob returned an empty download URL.');
  }

  return downloadUrl;
}
