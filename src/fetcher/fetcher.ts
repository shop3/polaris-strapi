import { Fetcher } from 'swr';

const fetcher: (authToken?: string) => Fetcher = (authToken) => (resource: string) =>
  fetch(resource, {
    headers: getHeadersAuthToken(authToken),
  }).then(async (response) => {
    const result = await response.json();
    if (response.status >= 400) throw new Error(result.error);
    return result;
  });

export default fetcher;

function getHeadersAuthToken(authToken?: string): Headers {
  if (authToken) {
    return new Headers({
      Authorization: `Bearer ${authToken}`,
    });
  }
  return new Headers();
}
