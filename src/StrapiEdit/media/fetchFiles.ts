import qs from 'qs';
import { DbFile } from './types';

async function fetchFiles(id: number | string, authToken?: string): Promise<DbFile>;
async function fetchFiles(ids: number[] | string[], authToken?: string): Promise<DbFile[]>;
async function fetchFiles(
  input: number | string | number[] | string[],
  authToken?: string
): Promise<DbFile | DbFile[]> {
  const response = await fetch(
    `/api/upload/files?${qs.stringify({
      filters: { id: { $in: Array.isArray(input) ? input : [input] } },
    })}`,
    {
      headers: getHeadersAuthToken(authToken),
    }
  );
  if (response.status >= 400) {
    const result = await response.json().catch(() => undefined);
    throw new Error(`Failed to get files: ${result ? JSON.stringify(result.error, null, 2) : 'unknown error'}`);
  }
  const results = await response.json();
  if (Array.isArray(input)) {
    return results;
  } else {
    return results[0];
  }
}

export default fetchFiles;

function getHeadersAuthToken(authToken?: string): Headers {
  if (authToken) {
    return new Headers({
      Authorization: `Bearer ${authToken}`,
    });
  }
  return new Headers();
}
