import express, { Router } from "express";
import { PrismaClient, User, UserTendency } from "@prisma/client";
import { sessionStore } from "../server";

interface UserInfo extends User {
  tendency: UserTendency | null
}

const router: Router = express.Router();
const prisma = new PrismaClient();

const defaultTendency: UserTendency = {
  userId: '',
  inward: 0,
  quickly: 0,
  song: 0,
  songName: null
}

const sessionList = new Map<string, string>();

/**
 * 세션 검색
 */
router.get('/', async (req: GetRequest, res: ExpressResponse) => {
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

        req.session.user = {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          image: user.image,
          inward: user.tendency.inward,
          quickly: user.tendency.quickly,
          song: user.tendency.song,
          songName: user.tendency.songName
        };

        res.status(200).json({ message: "success", data: req.session.user });
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
router.post('/', async (req: PostRequest<SessionLoginBody>, res: ExpressResponse) => {
  try {
    if(req.ip !== undefined) {
      const ip = req.ip === '::1' ? '127.0.0.1' : req.ip;
      
      const user = await prisma.user.findUnique({
        include: {
          tendency: true
        },
        where: {
          id: req.body.id,
          pw: req.body.pw
        }
      });

      if(user !== null) {
        const loginHistory = await prisma.userLoginHistory.create({
          data: {
            userId: req.body.id,
            ip: ip,
            success: false
          }
        })
        
        if(user.tendency === null) user.tendency = defaultTendency;
        
        await prisma.userLoginHistory.update({
          data: {
            success: true
          },
          where: {
            id: loginHistory.id
          }
        })

        sessionStore.destroy(sessionList.get(user.id) || "");

        sessionList.set(user.id, req.session.id)

        req.session.user = {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          image: user.image,
          inward: user.tendency.inward,
          quickly: user.tendency.quickly,
          song: user.tendency.song,
          songName: user.tendency.songName
        };

        res.status(200).json({ message: "success", data: req.session.user });
      } else {
        await prisma.userLoginHistory.create({
          data: {
            ip: ip,
            success: false
          }
        })

        res.status(202).json({ message: "아이디/비밀번호를 다시 입력해주세요." });
      }
    } else {
      new Error("세션 생성 인자 부족");
    }
  } catch {
    res.status(500).send({ message: "Internal Server Error" })
  }
})

/**
 * 세션 제거
 */
router.delete('/', async (req: PostRequest, res: ExpressResponse) => {
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