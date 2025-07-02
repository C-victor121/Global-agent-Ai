import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id?: string;
    role?: string;
  }

  interface Session extends DefaultSession {
    user?: {
      id?: string;
      role?: string;
    } & DefaultSession['user'];
  }

  interface Profile {
    id?: string;
    sub?: string;
    name?: string;
    email?: string;
    image?: string;
    picture?: string;
    role?: string;
  }
}