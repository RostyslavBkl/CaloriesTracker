import { ReactNode } from 'react';

export interface User {
	email: string;
	userId?: string;
}

export interface UserContextType {
	user: User | null;
	setUser: (user: User | null) => void;
}

export interface Props {
  children: ReactNode;
}
