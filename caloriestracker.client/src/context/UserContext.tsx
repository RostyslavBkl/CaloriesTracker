import React, { createContext, useState } from 'react';
import { Props, User, UserContextType } from './types';

const defaultContext: UserContextType = {
  user: null,
  setUser: () => {},
};

const UserContext = createContext<UserContextType>(defaultContext);

export default UserContext;

export const UserProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};