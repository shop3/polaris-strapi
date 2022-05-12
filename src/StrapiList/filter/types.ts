// filter option

export type FilterOption = {
  label: string;
  field: string;
  type: 'string' | 'number' | 'enum';
  options?: Array<{
    label: string;
    value: string;
  }>;
};

// list filter

type ListFilterType = string | number | boolean;

type ListFilterBase = {
  [k: string]: {
    // equality
    $eq?: ListFilterType;
    $ne?: ListFilterType;
    // inclusion
    $in?: ListFilterType[];
    $notIn?: ListFilterType[];
    // nullable
    $null?: boolean;
    $notNull?: boolean;
  };
};

export type ListFilter = ListFilterBase & {
  $or?: ListFilterBase[];
  $and?: ListFilterBase[];
};
