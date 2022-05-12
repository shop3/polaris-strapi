import React from 'react';
import { ListFilter } from './types';

export interface FilterContext {
  query: string;
  filters?: ListFilter;
  setQuery: (query: string) => void;
  setFilters: (filters?: ListFilter) => void;
}

export default React.createContext<FilterContext>({} as FilterContext);
