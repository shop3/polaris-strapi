import useSWR from 'swr';
import { fetcher } from '../fetcher';

const useResource = (resource: string) => useSWR(resource, fetcher);

export default useResource;
