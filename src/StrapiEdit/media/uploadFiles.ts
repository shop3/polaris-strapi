import { DbFile, isFileArray } from './types';

async function uploadFiles(input: File): Promise<DbFile>;
async function uploadFiles(input: File[]): Promise<DbFile[]>;
async function uploadFiles(input: File | File[]): Promise<DbFile | DbFile[]> {
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
  });
  if (response.status !== 200) {
    throw new Error('failed to upload files');
  }
  const result = await response.json();
  return result;
}

export default uploadFiles;
