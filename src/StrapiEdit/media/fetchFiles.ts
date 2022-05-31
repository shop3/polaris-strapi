import qs from 'qs';
import { DbFile } from './types';

async function fetchFiles(id: number | string): Promise<DbFile>;
async function fetchFiles(ids: number[] | string[]): Promise<DbFile[]>;
async function fetchFiles(input: number | string | number[] | string[]): Promise<DbFile | DbFile[]> {
  const response = await fetch(
    `/api/upload/files?${qs.stringify({
      filters: { id: { $in: Array.isArray(input) ? input : [input] } },
    })}`
  );
  if (response.status >= 400) {
    const result = await response.json().catch(() => undefined);
    throw new Error(`Failed to get files: ${result ? JSON.stringify(result.error, null, 2) : 'unknown error'}`);
  }
  const result = await response.json();
  if (Array.isArray(input)) {
    return result.results;
  } else {
    return result.results[0];
  }
}

export default fetchFiles;
