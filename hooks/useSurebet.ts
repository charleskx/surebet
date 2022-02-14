import { useContext } from 'react';
import { SurebetContext } from '../context/SurebetContext';

export function useSurebet() {
  const surebet = useContext(SurebetContext);

  return surebet;
}
