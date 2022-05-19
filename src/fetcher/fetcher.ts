import { Fetcher } from 'swr';

const fetcher: Fetcher = (resource: string) =>
  fetch(resource).then(async (response) => {
    const result = await response.json();
    if (response.status >= 400) throw new Error(result.error);
    return result;
  });

export default fetcher;
