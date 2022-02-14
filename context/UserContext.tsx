import { Users } from '@prisma/client';
import { createContext, useState, useCallback } from 'react';
import Route from 'next/router';

type UserContextType = {
  user?: Users;
  onLogIn: (user: Users) => void;
  onLogOut: () => void;
};

export const UserContext = createContext({} as UserContextType);

export function UserProvider({ children }: any) {
  const [user, setUser] = useState<Users>();

  const onLogIn = useCallback((data: Users) => {
    setUser(data);
    Route.push('/dashboard');
  }, []);

  const onLogOut = useCallback(() => {
    setUser(undefined);
  }, []);

  return (
    <UserContext.Provider value={{ user, onLogIn, onLogOut }}>
      {children}
    </UserContext.Provider>
  );
}
