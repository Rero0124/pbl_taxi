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
 * 세션 생성
 */
router.post('/', async (req: PostRequest<SessionIdParam, SessionBody>, res: ExpressResponse) => {
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

      await prisma.userSession.deleteMany({
        where: {
          userId: user.id
        }
      })
        
      await prisma.userLoginHistory.create({
        data: {
          userId: req.body.id,
          ip: ip,
          success: true
        }
      })

      const sessionId = (await prisma.userSession.create({
        select: {
          id: true,
        },
        data: {
          ip: ip,
          userId: req.body.id
        }
      })).id

      res.status(200).json({ session: sessionId, user: user });
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
    res.status(500).send("Internal Server Error")
  }
})

/**
 * 세션 검색
 */
router.get('/:id', async (req: GetRequest<SessionIdParam>, res: ExpressResponse) => {
  try {
    if(req.ip !== undefined) {
      const ip = req.ip === '::1' ? '127.0.0.1' : req.ip;
      const session: UserSession = await prisma.userSession.findFirstOrThrow({
        where: {
          id: req.params.id,
          ip: ip
        }
      });
      const user: UserInfo = await prisma.user.findUniqueOrThrow({
        include: {
          tendency: true
        },
        where: {
          id: session.userId
        }
      });

      if(user.tendency === null) user.tendency = defaultTendency;

      res.status(200).json({ session: session.id, user: user });
    } else {
      new Error("세션 검색 인자 부족");
    }
  } catch {
    res.status(500).send("Internal Server Error")
  }
})

/**
 * 세션 제거
 */
router.post('/delete', async (req: PostRequest<SessionIdParam, SessionBody>, res: ExpressResponse) => {
  try {
    if(req.ip !== undefined) {
      const ip = req.ip === '::1' ? '127.0.0.1' : req.ip;

      await prisma.userSession.delete({
        where: {
          id: req.body.id,
          ip: ip
        }
      })

      res.status(200).json({ message: "session deleted" });
    } else {
      new Error("세션 제거 인자 부족");
    }
  } catch {
    res.status(500).send("Internal Server Error")
  }
})

export default router;