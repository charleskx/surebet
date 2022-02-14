import { Users } from '@prisma/client';
import { createContext, useState, useCallback } from 'react';
import Route from 'next/router';

type UserContextType = {
  user?: Users;
  onLogIn: (user: Users, redirect: boolean) => void;
  onLogOut: () => void;
};

export const UserContext = createContext({} as UserContextType);

export function UserProvider({ children }: any) {
  const [user, setUser] = useState<Users>();

  const onLogIn = useCallback((data: Users, redirect: boolean) => {
    setUser(data);

    if (redirect) {
      localStorage.setItem('auth', JSON.stringify(data));
      Route.push('/dashboard');
    }
  }, []);

  const onLogOut = useCallback(() => {
    setUser(undefined);

    localStorage.removeItem('auth');
    Route.push('/');
  }, []);

  return (
    <UserContext.Provider value={{ user, onLogIn, onLogOut }}>
      {children}
    </UserContext.Provider>
  );
}
