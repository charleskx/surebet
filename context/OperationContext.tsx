import { createContext, useState, useCallback } from 'react';

type OperationContextType = {
  open: boolean;
  value: any;
  onOpenModal: (data: any) => void;
  onCloseModal: () => void;
};

export const OperationContext = createContext({} as OperationContextType);

export function OperationProvider({ children }: any) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState({});

  const onOpenModal = useCallback((data: any) => {
    setOpen(true);
    setValue(data);
  }, []);

  const onCloseModal = useCallback(() => {
    setOpen(false);
    setValue({});
  }, []);

  return (
    <OperationContext.Provider
      value={{
        open,
        value,
        onOpenModal,
        onCloseModal,
      }}
    >
      {children}
    </OperationContext.Provider>
  );
}
