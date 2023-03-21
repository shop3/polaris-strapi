import _ from 'lodash';

export function createErrorFromJson(json: any): Error {
  const error = new Error();
  Object.assign(error, json);
  return error;
}

export async function parseValidationErrors(error: any): Promise<Record<string, string> | undefined> {
  if (error.status === 400) {
    const errors = _.get(error, 'details.errors', []).reduce((acc: Record<string, string>, error: any) => {
      acc[fromPath(error.path)] = error.message as string;
      return acc;
    }, {});
    return errors;
  }
}

function fromPath(path: string[]): string {
  return path.reduce((acc: string, path: string) => {
    if (path.match(/^[0-9]+$/)) {
      return `${acc}[${path}]`;
    }
    if (acc === '') return path;
    return `${acc}.${path}`;
  }, '');
}
