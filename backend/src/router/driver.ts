import { PrismaClient } from "@prisma/client";
import express, { Router } from "express";

const router: Router = express.Router();

const drivers = new Map<string, ExpressResponse>();

router.get('/', (req: GetRequest, res: ExpressResponse) => {
  if(req.session.user !== undefined) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    
    drivers.set(req.session.user.id, res);
  } else {
    res.status(200).json({ message: "로그인을 먼저 해주세요.", action: "reload" });
  }
})

router.post('/message', (req: PostRequest<SendMessageBody>, res: ExpressResponse) => {
  req.body.userIds.forEach((userId) => {
    const userRes = drivers.get(userId);
    if(userRes) {
      switch(req.body.messageType) {
        case "search": userRes.write(`data: ${req.body.message} \n\n`);
      }
    }
  })
})

export default router;