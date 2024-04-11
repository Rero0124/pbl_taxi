import express, { Router } from "express";
import { Prisma, PrismaClient, User, UserTendency } from "@prisma/client";

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
 * 사용자 등록
 */
router.post('/', async (req: PostRequest<UserCreateBody>, res: ExpressResponse) => {
  try {
    const hasId = await prisma.user.findUnique({
      select: {
        id: true
      },
      where: {
        id: req.body.id
      }
    })

    if(hasId === null) {
      const user = await prisma.user.create({
        data: {
          id: req.body.id,
          pw: req.body.pw,
          name: req.body.name,
          phone: req.body.phone,
          email: req.body.email,
        }
      })
  
      res.status(200).json({ message: "success", action: "main" });
    } else {
      res.status(202).json({ message: "이미 해당 아이디가 존재합니다." });
    }
  } catch {
    res.status(500).send({ message: "Internal Server Error" })
  }
})

/**
 * 사용자 상세
 */
router.get('/:id', async (req: GetRequest<UserParams>, res: ExpressResponse) => {
  try {
    const userInfo: UserInfo = await prisma.user.findUniqueOrThrow({
      include: {
        tendency: true
      },
      where: {
        id: req.query.id
      }
    })
    
    defaultTendency.userId = userInfo.id;
    if(userInfo.tendency === null) userInfo.tendency = defaultTendency;

    res.status(200).json({ message: "success", data: userInfo });
  } catch {
    res.status(500).send({ message: "Internal Server Error" })
  }
})

/**
 * 사용자 초기 해제
 */
router.patch('/init', async (req: PatchRequest, res: ExpressResponse) => {
  try {
    if(req.session.user !== undefined) {
      const userInfo: UserInfo = await prisma.user.update({
        data: {
          init: false
        },
        include: {
          tendency: true
        },
        where: {
          id: req.session.user.id
        }
      })
      
      defaultTendency.userId = req.session.user.id;
      if(userInfo.tendency === null) userInfo.tendency = defaultTendency;
  
      res.status(200).json({ message: "success" });
    } else {
      res.status(200).json({ message: "로그인을 먼저 해주세요.", action: "reload" });
    }
  } catch {
    res.status(500).send({ message: "Internal Server Error" })
  }
})

router.put('/locate', async (req: PutRequest<UserLocateBody>, res: ExpressResponse) => {
  try {
    if(req.session.user !== undefined) {
      const locate = await prisma.userLocate.findUnique({
        where: {
          userId: req.session.user.id
        }
      });
  
      const query = Prisma.raw( locate === null ? 
                        `INSERT INTO "UserLocate" ("userId", "geom") VALUES ('${req.session.user.id}', ST_GeomFromText('Point(${req.body.x} ${req.body.y})', 4326))` : 
                        `UPDATE "UserLocate" SET "geom" = ST_GeomFromText('Point(${req.body.x} ${req.body.y})', 4326) WHERE "userId" = '${req.session.user.id}'`)
  
      await prisma.$executeRaw(query)
  
      res.status(200).json({ message: "success" });
    } else {
      res.status(200).json({ message: "로그인을 먼저 해주세요.", action: "reload" });
    }
  } catch {
    res.status(500).send({ message: "Internal Server Error" })
  }
})

/**
 * 사용자 성향 수정
 */
router.put('/tendency', async (req: PutRequest<UserTendencyBody>, res: ExpressResponse) => {
  try {
    if(req.session.user !== undefined) {
      const tendency = await prisma.userTendency.findUnique({
        where: {
          userId: req.session.user.id
        }
      });
      const result = tendency === null ? (
        await prisma.userTendency.create({
          data: {
            userId: req.session.user.id,
            inward: req.body.inward,
            quickly: req.body.quickly,
            song: req.body.song,
            songName: req.body.songName
          }
        })
      ) : ( 
        await prisma.userTendency.update({
          data: {
            inward: req.body.inward,
            quickly: req.body.quickly,
            song: req.body.song,
            songName: req.body.songName
          },
          where: {
            userId: req.session.user.id
          }
        })
      )
      res.status(200).json({ message: "success", data: result });
    } else {
      res.status(200).json({ message: "로그인을 먼저 해주세요.", action: "reload" });
    }
  } catch {
    res.status(500).send({ message: "Internal Server Error" })
  }
})

/**
 * 사용자 비밀번호 변경
 */

router.patch('/password', async (req: PatchRequest<UserChangePasswordBody>, res: ExpressResponse) => {
  try {
    if(req.session.user !== undefined) {
      const user = await prisma.user.findUnique({
        where: {
          id: req.session.user.id,
          pw: req.body.pw
        }
      });

      if(user !== null) {
        await prisma.user.update({
          data: {
            pw: req.body.npw
          },
          where: {
            id: req.session.user.id,
          }
        });
        res.status(200).json({ message: "success" });
      } else {
        res.status(202).json({ message: "기존 비밀번호를 다시 입력해주세요." });
      }
    } else {
      res.status(200).json({ message: "로그인을 먼저 해주세요.", action: "reload" });
    }
  } catch {
    res.status(500).send({ message: "Internal Server Error" })
  }
})

/**
 * 사용자 팔로우 리스트 검색
 */

router.get('/follow', async (req: GetRequest, res: ExpressResponse) => {
  try {
    if(req.session.user !== undefined) {
      const followList = await prisma.userFollowList.findMany({
        where: {
          userId: req.session.user.id
        }
      });
      res.status(200).json({ message: "success", data: followList });
    } else {
      res.status(200).json({ message: "로그인을 먼저 해주세요.", action: "reload" });
    }
  } catch {
    res.status(500).send({ message: "Internal Server Error" })
  }
})

/**
 * 사용자 밴 리스트 검색
 */

router.get('/ban', async (req: GetRequest, res: ExpressResponse) => {
  try {
    if(req.session.user !== undefined) {
      const banList = await prisma.userBanList.findMany({
        where: {
          userId: req.session.user.id
        }
      });
      res.status(200).json({ message: "success", data: banList });
    } else {
      res.status(200).json({ message: "로그인을 먼저 해주세요.", action: "reload" });
    }  
  } catch {
    res.status(500).send({ message: "Internal Server Error" })
  }
})

/**
 * 사용자 팔로우
 */

router.post('/follow', async (req: PostRequest<TargetUserBody>, res: ExpressResponse) => {
  try {
    if(req.session.user !== undefined) {
      const follow = await prisma.userFollowList.create({
        data: {
          userId: req.session.user.id,
          followedUserId: req.body.userId
        }
      });
      
      res.status(200).json({ message: "success", data: follow });
    } else {
      res.status(200).json({ message: "로그인을 먼저 해주세요.", action: "reload" });
    }
  } catch {
    res.status(500).send({ message: "Internal Server Error" })
  }
})

/**
 * 사용자 밴
 */

router.post('/ban', async (req: PostRequest<TargetUserBody>, res: ExpressResponse) => {
  try {
    if(req.session.user !== undefined) {
      const ban = await prisma.userBanList.create({
        data: {
          userId: req.session.user.id,
          bannedUserId: req.body.userId
        }
      });
      res.status(200).json({ message: "success", data: ban });
    } else {
      res.status(200).json({ message: "로그인을 먼저 해주세요.", action: "reload" });
    }
  } catch {
    res.status(500).send({ message: "Internal Server Error" })
  }
})

export default router;
