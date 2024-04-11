import express, { Router } from "express";
import { PrismaClient, User, UserSession, UserTendency } from "@prisma/client";

interface UserInfo extends User {
  tendency: UserTendency | null
}

const router: Router = express.Router();
const prisma = new PrismaClient();

const defaultTendency: UserTendency = {
  userId: '',
  inward: true,
  quickly: true,
  song: true,
  songName: null
}

/**
 * 세션 검색
 */
router.get('/', async (req: GetRequest<SessionIdParam>, res: ExpressResponse) => {
  try {
    if(req.ip !== undefined) {
      if(req.session.user !== undefined) {
        const ip = req.ip === '::1' ? '127.0.0.1' : req.ip;

        const user: UserInfo = await prisma.user.findUniqueOrThrow({
          include: {
            tendency: true
          },
          where: {
            id: req.session.user.id
          }
        });

        if(user.tendency === null) user.tendency = defaultTendency;
        req.session.user = user;
        res.status(200).json({ message: "success", data: user });
      } else {
        res.status(200).json({ message: "먼저 로그인을 해주세요." });
      }
    } else {
      new Error("세션 검색 인자 부족");
    }
  } catch {
    res.status(500).send({ message: "Internal Server Error" })
  }
})

/**
 * 세션 생성
 */
router.post('/', async (req: PostRequest<SessionBody>, res: ExpressResponse) => {
  try {
    if(req.body.pw !== undefined && req.ip !== undefined) {
      const ip = req.ip === '::1' ? '127.0.0.1' : req.ip;
      const user: UserInfo = await prisma.user.findUniqueOrThrow({
        include: {
          tendency: true
        },
        where: {
          id: req.body.id,
          pw: req.body.pw
        }
      });

      if(user.tendency === null) user.tendency = defaultTendency;
        
      await prisma.userLoginHistory.create({
        data: {
          userId: req.body.id,
          ip: ip,
          success: true
        }
      })

      req.session.user = user;
      res.status(200).json({ message: "success", data: user });
    } else {
      new Error("세션 생성 인자 부족");
    }
  } catch {
    if(req.body.id !== undefined && req.ip !== undefined) {
      await prisma.userLoginHistory.create({
        data: {
          userId: req.body.id,
          ip: req.ip === '::1' ? '127.0.0.1' : req.ip,
          success: false
        }
      })
    }
    res.status(500).send({ message: "Internal Server Error" })
  }
})

/**
 * 세션 제거
 */
router.post('/delete', async (req: PostRequest<SessionBody>, res: ExpressResponse) => {
  try {
    if(req.session.user !== undefined) {
      req.session.destroy((err) => {
        // Debug
        // console.log(err)
        new Error("세션 삭제 에러");
      });
      res.status(200).json({ message: "success", action: "main" });
    } else {
      res.status(200).json({ message: "로그인 상태가 아닙니다.", action: "main" });
    }
  } catch {
    res.status(500).send({ message: "Internal Server Error" })
  }
})

export default router;