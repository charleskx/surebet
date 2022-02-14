import { useContext } from 'react';
import { OperationContext } from '../context/OperationContext';

export function useOperation() {
  const operation = useContext(OperationContext);

  return operation;
}
