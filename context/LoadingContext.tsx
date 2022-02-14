import { createContext, useState, useCallback } from 'react';

type LoadingContextType = {
  toggleLoading: (load: boolean) => void;
  loading: boolean;
};

export const LoadingContext = createContext({} as LoadingContextType);

export function LoadingProvider({ children }: any) {
  const [loading, setLoading] = useState<boolean>(false);

  const toggleLoading = useCallback((data: boolean): void => {
    setLoading(data);
  }, []);

  return (
    <LoadingContext.Provider value={{ toggleLoading, loading }}>
      {children}
    </LoadingContext.Provider>
  );
}
