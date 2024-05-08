import { PrismaClient } from "@prisma/client";
import express, { Router } from "express";

const router: Router = express.Router();

const allUsers = new Map<string, ExpressResponse>();
const drivers = new Map<string, ExpressResponse>();

router.delete('/', (req: DeleteRequest, res: ExpressResponse) => {
  if(req.session.user !== undefined) {
    const userId = req.session.user.id;
    allUsers.delete(userId);
    drivers.delete(userId);
  } else {
    res.status(200).json({ message: "로그인을 먼저 해주세요.", action: "reload" });
  }
})

router.get('/:appType', (req: GetRequest<{appType: string}>, res: ExpressResponse) => {
  if(req.session.user !== undefined) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    
    allUsers.set(req.session.user.id, res);
    if(req.params.appType === "driver") {
      drivers.set(req.session.user.id, res);
    }
  } else {
    res.status(200).json({ message: "로그인을 먼저 해주세요.", action: "reload" });
  }
})

router.post('/notice', (req: PostRequest<SendMessageBody>, res: ExpressResponse) => {
  if(req.session.user !== undefined) {
    allUsers.forEach((res) => {
      res.write(`data: ${req.body.message} \n\n`);
    }) 
  } else {
    res.status(200).json({ message: "로그인을 먼저 해주세요.", action: "reload" });
  }
})

router.post('/driver/:driverId', async (req: PostRequest<{}, {driverId: string}>, res: ExpressResponse) => {
  if(req.session.user !== undefined) {
    drivers.get(req.session.user.id)?.write(`data: called@${req.params.driverId} \n\n`);
  } else {
    res.status(200).json({ message: "로그인을 먼저 해주세요.", action: "reload" });
  }
})

export default router;