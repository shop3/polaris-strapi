import { useEffect, useState } from 'react';

type FreshValue<T> = T | undefined;
type Refresh = () => void;

const useRefreshable = <T>(onRefresh: () => T): [FreshValue<T>, Refresh] => {
  const [freshValue, setFreshValue] = useState<T>();
  const [shouldRefresh, refresh] = useState(false);
  // refresh value
  useEffect(() => {
    if (shouldRefresh) {
      const newFreshValue = onRefresh();
      if (freshValue !== newFreshValue) {
        setFreshValue(newFreshValue);
      }
      refresh(false);
    }
  }, [shouldRefresh]);

  return [freshValue, () => refresh(true)];
};

export default useRefreshable;
