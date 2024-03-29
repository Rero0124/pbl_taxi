import express, { Router } from "express";
import { Prisma, PrismaClient, User, UserTendency } from "@prisma/client";
import { GetUserInfoRequest, PostUserCreateRequest, PutUserTendencyRequest, PatchUserChangePasswordRequest, PostUserFollowCreateRequest, PatchUserInitRequest, PutUserLocationRequest } from "./types/user";

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
router.post('/', async (req: PostUserCreateRequest, res: ExpressResponse) => {
  try {
    if(req.body.name !== undefined && req.body.phone !== undefined && req.body.email !== undefined) {
      const user = await prisma.user.create({
        data: {
          id: req.body.id,
          pw: req.body.pw,
          name: req.body.name,
          phone: req.body.phone,
          email: req.body.email,
        }
      })

      res.status(200).json(user);
    } else {
      new Error('사용자 등록 인자 부족');
    }
  } catch {
    res.status(500).send("Internal Server Error")
  }
})

/**
 * 사용자 상세
 */
router.get('/:id', async (req: GetUserInfoRequest, res: ExpressResponse) => {
  try {
    const userInfo: UserInfo = await prisma.user.findUniqueOrThrow({
      include: {
        tendency: true
      },
      where: {
        id: req.params.id
      }
    })
    
    defaultTendency.userId = userInfo.id;
    if(userInfo.tendency === null) userInfo.tendency = defaultTendency;

    res.status(200).json(userInfo);
  } catch {
    res.status(500).send("Internal Server Error")
  }
})

/**
 * 사용자 초기 해제
 */
router.patch('/:id/init', async (req: PatchUserInitRequest, res: ExpressResponse) => {
  try {
    const userInfo: UserInfo = await prisma.user.update({
      data: {
        init: false
      },
      include: {
        tendency: true
      },
      where: {
        id: req.params.id
      }
    })
    
    defaultTendency.userId = userInfo.id;
    if(userInfo.tendency === null) userInfo.tendency = defaultTendency;

    res.status(200).json(userInfo);
  } catch {
    res.status(500).send("Internal Server Error")
  }
})

router.put('/:id/locate', async (req: PutUserLocationRequest, res: ExpressResponse) => {
  try {
    const locate = await prisma.userLocate.findUnique({
      where: {
        userId: req.params.id
      }
    });

    const query = Prisma.raw( locate === null ? 
                      `INSERT INTO "UserLocate" ("userId", "geom") VALUES ('${req.params.id}', ST_GeomFromText('Point(${req.body.x} ${req.body.y})', 4326))` : 
                      `UPDATE "UserLocate" SET "geom" = ST_GeomFromText('Point(${req.body.x} ${req.body.y})', 4326) WHERE "userId" = '${req.params.id}'`)

    const result = await prisma.$executeRaw(query)

    res.status(200).json(result);
  } catch {
    res.status(500).send("Internal Server Error")
  }
})

/**
 * 사용자 성향 수정
 */
router.put('/:id/tendency', async (req: PutUserTendencyRequest, res: ExpressResponse) => {
  try {
    const tendency = await prisma.userTendency.findUnique({
      where: {
        userId: req.params.id
      }
    });
    const result = tendency === null ? (
      await prisma.userTendency.create({
        data: {
          userId: req.params.id,
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
          userId: req.params.id
        }
      })
    )

    if(result !== null) {
      res.status(200).json(result);
    } else {
      new Error('성향 등록 실패');
    }
  } catch {
    res.status(500).send("Internal Server Error")
  }
})

/**
 * 사용자 비밀번호 변경
 */

router.patch('/:id/password', async (req: PatchUserChangePasswordRequest, res: ExpressResponse) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
        pw: req.body.pw
      }
    });

    if(user !== null) {
      await prisma.user.update({
        data: {
          pw: req.body.npw
        },
        where: {
          id: req.params.id,
        }
      });
      res.status(200).json({result: true});
    } else {
      res.status(202).json({result: false});
    }
  } catch {
    res.status(500).send("Internal Server Error")
  }
})

/**
 * 사용자 팔로우 리스트 검색
 */

router.get('/:id/follow', async (req: GetUserInfoRequest, res: ExpressResponse) => {
  try {
    const followList = await prisma.userFollowList.findMany({
      where: {
        userId: req.params.id
      }
    });
    res.status(200).json(followList);
  } catch {
    res.status(500).send("Internal Server Error")
  }
})

/**
 * 사용자 밴 리스트 검색
 */

router.get('/:id/ban', async (req: GetUserInfoRequest, res: ExpressResponse) => {
  try {
    const banList = await prisma.userBanList.findMany({
      where: {
        userId: req.params.id
      }
    });
    res.status(200).json(banList);
  } catch {
    res.status(500).send("Internal Server Error")
  }
})

/**
 * 사용자 팔로우
 */

router.post('/:id/follow', async (req: PostUserFollowCreateRequest, res: ExpressResponse) => {
  try {
    const follow = await prisma.userFollowList.create({
      data: {
        userId: req.params.id,
        followedUserId: req.body.userId
      }
    });
    res.status(200).json(follow);
  } catch {
    res.status(500).send("Internal Server Error")
  }
})

/**
 * 사용자 밴
 */

router.post('/:id/ban', async (req: PostUserFollowCreateRequest, res: ExpressResponse) => {
  try {
    const ban = await prisma.userBanList.create({
      data: {
        userId: req.params.id,
        bannedUserId: req.body.userId
      }
    });
    res.status(200).json(ban);
  } catch {
    res.status(500).send("Internal Server Error")
  }
})

export default router;
