import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import express from 'express';
import expressSession from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';
import https, { ServerOptions } from 'https'
import cors from 'cors';
import user from './router/user';
import auth from './router/auth';
import search from './router/search';
import driver from './router/driver';

dotenv.config();

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: path.join(__dirname, '../.env.production'), override: true })
} else if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: path.join(__dirname, '../.env.development'), override: true })
} else {
  throw new Error('process.env.NODE_ENV를 설정하지 않았습니다!')
}

const server = express();
const port = 5678;
const sslOption: ServerOptions = {
  key: fs.readFileSync("../www.rero0124.com_202404098D4E4.key.pem"),
  cert: fs.readFileSync("../www.rero0124.com_202404098D4E4.all.crt.pem"),
  minVersion: "TLSv1.2"
}

server.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: " ",
  cookie: {
    httpOnly: true,
    secure: true
  },
  store: new PrismaSessionStore(
    new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000,
    }
  )
}))

server.use('/user', user);
server.use('/auth', auth);
server.use('/search', search);
server.use('/driver', driver);

https.createServer(sslOption, server).listen(port, () => { console.log('서버 시작') })