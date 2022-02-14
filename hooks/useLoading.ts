import { useContext } from 'react';
import { LoadingContext } from '../context/LoadingContext';

export function useLoading() {
  const loading = useContext(LoadingContext);

  return loading;
}
