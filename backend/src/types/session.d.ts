import 'express-session';

declare module 'express-session' {
  interface SessionData {
    cookie: Cookie;
    user?: SessionUser;
  }
}

interface SessionUser {
  id: string;
  name: string | null;
  phone: number;
  email: string | null;
  image: string | null;
  inward: boolean;
  quickly: boolean;
  song: boolean;
  songName?: string | null;
}