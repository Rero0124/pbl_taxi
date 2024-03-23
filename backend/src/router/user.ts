
import express, { Request, Response, Router } from "express";
import { PrismaClient, User, UserTendency } from "@prisma/client";

interface GetUserInfoRequest extends Request {
  readonly params: {
    id: string;
  }
}

interface PostUserCreateRequest extends Request {
  readonly body: {
    id: string;
    pw: string;
    name?: string;
    phone?: number;
    email?: string;
  }
}

interface PatchUserTendencyRequest extends Request {
  readonly body: {
    id: string;
    inward: boolean;
    quickly: boolean;
    song: boolean;
    songName?: string;
  }
}

interface PutUserChangePasswordRequest extends Request {
  readonly body: {
    id: string;
    pw?: string;
  }
}

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
router.post('/', async (req: PostUserCreateRequest, res: Response) => {
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
      new Error('type error');
    }
  } catch {
    res.status(500).send("Internal Server Error")
  }
})

/**
 * 사용자 상세
 */
router.get('/:id', async (req: GetUserInfoRequest, res: Response) => {
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
router.patch('/tendency', async (req: PatchUserTendencyRequest, res: Response) => {
  try {
    const tendency = await prisma.userTendency.findUnique({
      where: {
        userId: req.body.id
      }
    });
    const result = tendency === null ? (await prisma.userTendency.create({
        data: {
          userId: req.body.id,
          inward: req.body.inward,
          quickly: req.body.quickly,
          song: req.body.song,
          songName: req.body.songName
        }
      })
    ) : ( await prisma.userTendency.update({
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
