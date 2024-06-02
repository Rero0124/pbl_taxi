import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const router = Router();
const prisma = new PrismaClient();

interface EventData {
  eventType: string;
  eventTitle: string;
  eventMessage: string;
}

router.get("/", async (req: GetRequest, res: ExpressResponse) => {
  try {
    if(req.session.user !== undefined) {
      const events = await prisma.userEvent.findMany({
        select: {
          id: true,
          eventType: true,
          eventTitle: true,
          eventMessage: true,
          createAt: true,
        },
        where: {
          userId: req.session.user.id
        }
      })
      res.status(200).json({ message: "success", data: events });
    } else {
      res.status(200).json({ message: "로그인을 먼저 해주세요.", action: "reload" });
    }
  } catch {
    res.status(500).send({ message: "Internal Server Error" })
  }
});

router.delete("/:id", async (req: DeleteRequest<{id: string}>, res: ExpressResponse) => {
  try {
    if(req.session.user !== undefined) {
      await prisma.userEvent.delete({
        where: {
          id: Number(req.params.id)
        }
      })
      res.status(200).json({ message: "success" });
    } else {
      res.status(200).json({ message: "로그인을 먼저 해주세요.", action: "reload" });
    }
  } catch {
    res.status(500).send({ message: "Internal Server Error" })
  }
});

export const addEvent = async (userId: string, eventData: EventData) => {
  await prisma.userEvent.create({
    data: {
      userId: userId,
      ...eventData
    }
  })
}

export default router;