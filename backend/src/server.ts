import dotenv from 'dotenv';
import path from 'path';
import express from 'express';

dotenv.config();

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: path.join(__dirname, '../.env.production'), override: true })
} else if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: path.join(__dirname, '../.env.development'), override: true })
} else {
  throw new Error('process.env.NODE_ENV를 설정하지 않았습니다!')
}

const app = express();
const port = 5678;

app.listen(port, () => { console.log('서버 시작') });