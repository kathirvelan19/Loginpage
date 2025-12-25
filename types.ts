// src/types.ts
import { User as FirebaseUser, UserCredential } from 'firebase/auth';

export type User = FirebaseUser;

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  googleSignIn: () => Promise<UserCredential>;
  logout: () => Promise<void>;
}