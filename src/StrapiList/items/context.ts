import React from 'react';

interface ItemContext {
  id: number | string;
  index: number;
  item: unknown;
  isLoading: boolean;
}

export default React.createContext<ItemContext>({} as ItemContext);
