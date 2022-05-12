import React from 'react';
import { ListPagination } from './types';

export interface PaginationContext {
  totalItems: number;
  pagination: ListPagination;
  setPagination: (pagination: ListPagination) => void;
}

export default React.createContext<PaginationContext>({} as PaginationContext);
