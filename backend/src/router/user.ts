import express, { Router } from "express";
import { PrismaClient, User, UserTendency } from "@prisma/client";
import { GetUserInfoRequest, PatchUserTendencyRequest, PostUserCreateRequest } from "./types/user";

interface UserInfo extends User {
  tendency: UserTendency | null
}

const router: Router = express.Router();
const prisma = new PrismaClient();

const defaultTendency: UserTendency = {
  userId: '',
  inward: false,
  quickly: false,
  song: false,
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
 * 사용자 성향 수정
 */
router.patch('/tendency', async (req: PatchUserTendencyRequest, res: ExpressResponse) => {
  try {
    const tendency = await prisma.userTendency.findUnique({
      where: {
        userId: req.body.id
      }
    });
    const result = await tendency === null ? (
      prisma.userTendency.create({
        data: {
          userId: req.body.id,
          inward: req.body.inward,
          quickly: req.body.quickly,
          song: req.body.song,
          songName: req.body.songName
        }
      })
    ) : ( 
      prisma.userTendency.update({
        data: {
          inward: req.body.inward,
          quickly: req.body.quickly,
          song: req.body.song,
          songName: req.body.songName
        },
        where: {
          userId: req.body.id
        }
      })
    )
    res.status(200).json(result);
  } catch {
    res.status(500).send("Internal Server Error")
  }
})

/**
 * 사용자 성향 수정
 */
router.patch('/tendency', async (req: PatchUserTendencyRequest, res: ExpressResponse) => {
  try {
    const tendency = await prisma.userTendency.findUnique({
      where: {
        userId: req.body.id
      }
    });
    const result = await tendency === null ? (
      prisma.userTendency.create({
        data: {
          userId: req.body.id,
          inward: req.body.inward,
          quickly: req.body.quickly,
          song: req.body.song,
          songName: req.body.songName
        }
      })
    ) : ( 
      prisma.userTendency.update({
        data: {
          inward: req.body.inward,
          quickly: req.body.quickly,
          song: req.body.song,
          songName: req.body.songName
        },
        where: {
          userId: req.body.id
        }
      })
    )
    res.status(200).json(result);
  } catch {
    res.status(500).send("Internal Server Error")
  }
})

router.get('/tendency/:id', async (req: PatchUserTendencyRequest, res: ExpressResponse) => {
  try {
    const tendency = await prisma.userTendency.findUnique({
      where: {
        userId: req.body.id
      }
    });
    const result = await tendency === null ? (
      prisma.userTendency.create({
        data: {
          userId: req.body.id,
          inward: req.body.inward,
          quickly: req.body.quickly,
          song: req.body.song,
          songName: req.body.songName
        }
      })
    ) : ( 
      prisma.userTendency.update({
        data: {
          inward: req.body.inward,
          quickly: req.body.quickly,
          song: req.body.song,
          songName: req.body.songName
        },
        where: {
          userId: req.body.id
        }
      })
    )
    res.status(200).json(result);
  } catch {
    res.status(500).send("Internal Server Error")
  }
})

export default router;
