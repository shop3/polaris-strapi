export type DbFile = {
  id: number;
  attributes: any;
};

export function isFileArray(value: any): value is File[] {
  return Array.isArray(value) && value.every((v) => v instanceof File);
}
