import useSWR from 'swr';
import { fetcher } from '../fetcher';

const useResource = (resource: string, authToken?: string) => useSWR(resource, fetcher(authToken));

export default useResource;
