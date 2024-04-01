import { PrismaClient } from "@prisma/client";
import express, { Router } from "express";

const router: Router = express.Router();

const drivers = new Map<string, ExpressResponse>();

router.get('/:id', (req: GetRequest<UserIdParam>, res: ExpressResponse) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  drivers.set(req.params.id, res);
})

router.post('/message', (req: PostRequest<{}, SendMessageBody>, res: ExpressResponse) => {
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