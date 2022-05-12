export type Form = {
  [k: string]: any;
};

export type DbEntity = {
  data: {
    id: number;
    attributes: {
      [k: string]: any;
    };
  };
  meta: {
    [k: string]: any;
  };
};
