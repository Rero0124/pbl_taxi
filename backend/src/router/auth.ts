import express, { Request, Response, Router } from "express";
import { PrismaClient, UserSession } from "@prisma/client";

interface UserInfo {
  id: string;
  name: string;
  phone: number;
  email: string;
  createdAt: Date;
  updatedAt: Date | null;
}

interface AuthGetRequest extends Request {
  readonly params: {
    id: string;
  }
}

interface AuthPostRequest extends Request {
  readonly body: {
    id: string;
    pw?: string;
    sessionId?: string
  }
}

const router: Router = express.Router();
const prisma = new PrismaClient();

/**
 * 세션 생성
 */
router.post('/', (req: AuthPostRequest, res: Response) => {
    if(req.body.pw !== undefined && req.ip) {
    const ip = req.ip === '::1' ? '127.0.0.1' : req.ip;
    prisma.user.findUniqueOrThrow({
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        createdAt: true,
        updatedAt: true
      },
      where: {
        id: req.body.id,
        pw: req.body.pw
      }
    }).then((user: UserInfo) => {
      prisma.userSession.deleteMany({
        where: {
          userId: req.body.id
        }
      }).then(() => {
        prisma.userSession.create({
          select: {
            id: true,
          },
          data: {
            ip: ip,
            userId: req.body.id
          }
        }).then(async (session) => {
          await prisma.userLoginHistory.create({
            data: {
              userId: req.body.id,
              ip: ip,
              success: true
            }
          })
          res.status(200).json({ session: session.id, user: user });
        }).catch(async () => {
          await prisma.userLoginHistory.create({
            data: {
              userId: req.body.id,
              ip: ip,
              success: false
            }
          })
          res.status(500).send("Internal Server Error")
        })
      }).catch(() => {
        res.status(500).send("Internal Server Error")
      })
    }).catch(async () => {
      await prisma.userLoginHistory.create({
        data: {
          userId: req.body.id,
          ip: ip,
          success: false
        }
      })
      res.status(500).send("Internal Server Error")
    })
  } else {
    res.status(500).send("Internal Server Error")
  }
})

/**
 * 세션 검색
 */
router.get('/:id', (req: AuthGetRequest, res: Response) => {
  const ip = req.ip === '::1' ? '127.0.0.1' : req.ip;
  prisma.userSession.findFirstOrThrow({
    select: {
      id: true,
      userId: true,
    },
    where: {
      id: req.params.id,
      ip: ip
    }
  }).then((session) => {
    prisma.user.findUniqueOrThrow({
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        createdAt: true,
        updatedAt: true
      },
      where: {
        id: session.userId
      }
    }).then((user: UserInfo) => {
      res.status(200).json({ session: session.id, user: user });
    }).catch(() => {
      res.status(500).send("Internal Server Error")
    })
  }).catch(() => {
    res.status(500).send("Internal Server Error")
  })
})

/**
 * 세션 제거
 */
router.post('/delete', (req: AuthPostRequest, res: Response) => {
  const ip = req.ip === '::1' ? '127.0.0.1' : req.ip;
  prisma.userSession.delete({
    where: {
      id: req.body.id,
      ip: ip
    }
  }).then(() => {
    res.status(200).json({ message: "session deleted" });
  }).catch(() => {
    res.status(500).send("Internal Server Error")
  })
})

export default router;