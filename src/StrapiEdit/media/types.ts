export type DbFile = {
  id: number;
  name: string;
  mime: string;
  size: number;
  url: string;
  ext: string;
  [k: string]: any;
};

export function isFile(value: any): value is File {
  return value instanceof File;
}

export function isFileArray(value: any): value is File[] {
  return Array.isArray(value) && value.every(isFile);
}

export function isId(value: any): value is number | string {
  return ['number', 'string'].includes(typeof value);
}

export function isIdArray(value: any): value is number[] | string[] {
  return Array.isArray(value) && value.every(isId);
}

export function isFileDb(value: any): value is DbFile {
  return (
    typeof value.id === 'number' &&
    typeof value.name === 'string' &&
    typeof value.size === 'number' &&
    typeof value.mime === 'string' &&
    typeof value.url === 'string'
  );
}

export function isFileDbArray(value: any): value is DbFile[] {
  return Array.isArray(value) && value.every(isFileDb);
}
