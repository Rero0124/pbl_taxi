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
  inward: number | 0;
  quickly: number | 0;
  song: number | 0;
  songName?: string | null;
}