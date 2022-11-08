import { DbFile, isFileArray } from './types';

async function uploadFiles(input: File, authToken?: string): Promise<DbFile>;
async function uploadFiles(input: File[], authToken?: string): Promise<DbFile[]>;
async function uploadFiles(input: File | File[], authToken?: string): Promise<DbFile | DbFile[]> {
  const formData = new FormData();
  if (input instanceof File) {
    formData.append('files', input, input.name);
  } else if (isFileArray(input)) {
    for (const file of input) {
      formData.append('files', file, file.name);
    }
  }
  const response = await fetch('/api/upload', {
    method: 'post',
    body: formData,
    headers: getHeadersAuthToken(authToken),
  });
  if (response.status >= 400) {
    const result = await response.json().catch(() => undefined);
    throw new Error(`Failed to upload files: ${result ? JSON.stringify(result.error, null, 2) : 'unknown error'}`);
  }
  const result = await response.json();
  if (input instanceof File) {
    return result[0];
  } else if (isFileArray(input)) {
    return result;
  }
  throw new Error('Something went wrong with files upload');
}

export default uploadFiles;

function getHeadersAuthToken(authToken?: string): Headers {
  if (authToken) {
    return new Headers({
      Authorization: `Bearer ${authToken}`,
    });
  }
  return new Headers();
}
