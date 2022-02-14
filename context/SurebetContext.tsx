import { createContext, useState, useCallback } from 'react';

type SurebetContextType = {
  bet: String;
  open: boolean;
  onRegisterBet: (data: string) => void;
  onProcessBet: () => void;
  onCancellBet: () => void;
  onOpenModal: () => void;
};

export const SurebetContext = createContext({} as SurebetContextType);

export function SurebetProvider({ children }: any) {
  const [open, setOpen] = useState(false);
  const [bet, SetBet] = useState('');

  const onRegisterBet = useCallback((data: string) => {
    SetBet(data);
  }, []);

  const onProcessBet = useCallback(() => {
    console.log('bet', bet);
  }, [bet]);

  const onCancellBet = useCallback(() => {
    setOpen(false);
    SetBet('');
  }, []);

  const onOpenModal = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <SurebetContext.Provider
      value={{
        bet,
        open,
        onRegisterBet,
        onProcessBet,
        onCancellBet,
        onOpenModal,
      }}
    >
      {children}
    </SurebetContext.Provider>
  );
}
