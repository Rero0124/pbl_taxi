import { PrismaClient } from "@prisma/client";
import express, { Router } from "express";
import { SessionUser } from "../types/session";
import { addEvent } from "./event";

const router: Router = express.Router();

const prisma = new PrismaClient();

const allUsers = new Map<string, ExpressResponse>();
const drivers = new Map<string, ExpressResponse>();

const driverLocateSendInterval = new Map<string, NodeJS.Timeout>();

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

export const unsetResponse = async (userId: string) => {
  allUsers.delete(userId);
  drivers.delete(userId);
}

export const callSendDriver = async (customer: SessionUser, driverId: string, address: MatchAddress) => {
  const driverResponse = drivers.get(driverId);
  if(driverResponse) {
    const eventData = {
      event: "called",
      data: {
        customer: customer,
        address: address
      }
    }

    driverResponse.write(`data: ${JSON.stringify(eventData)}\n\n`);
  }
}

export const matchSend = async (customer: SessionUser, driver: SessionUser, address: MatchAddress) => {
  const customerResponse = allUsers.get(customer.id);
  const driverResponse = allUsers.get(driver.id);
  if(customerResponse && driverResponse) {
    const customerEventData = {
      event: "matchedDriver",
      data: {
        driver: driver,
        address: address
      }
    }

    const driverEventData = {
      event: "matchedCustomer",
      data: {
        customer: customer,
        address: address
      }
    }

    customerResponse.write(`data: ${JSON.stringify(customerEventData)}\n\n`);
    driverResponse.write(`data: ${JSON.stringify(driverEventData)}\n\n`);

    setDriverLocateSend(customer.id, driver.id);
  }
}

const setDriverLocateSend = async (customerId: string, driverId: string) => {
  const customerResponse = allUsers.get(customerId);
  if(customerResponse) {
    const id = setInterval(async () => {
      const locate = await prisma.$queryRawUnsafe<{x: number, y: number}[]>(`
        SELECT ST_X("geom") as x, ST_Y("geom") as y FROM "UserLocate" WHERE "userId" = '${driverId}'
      `)

      const driverLocateData = { 
      }

      allUsers.get(customerId)?.write(`data: ${JSON.stringify(driverLocateData)}\n\n`);
    }, 5000);

    driverLocateSendInterval.set(customerId, id);
  }
}

export const matchEnd = async (customerId: string, driverId: string, driverName: string | null, type: string) => {
  const customerResponse = allUsers.get(customerId);
  if(customerResponse) {
    clearInterval(driverLocateSendInterval.get(customerId));
    const matchEndData = {
      event: "matchEnd",
      data: {
        type: type,
        driverId: driverId
      }
    }

    allUsers.get(customerId)?.write(`data: ${JSON.stringify(matchEndData)}\n\n`);

    if(type === "cancel") {
      addEvent(customerId, {
        eventType: "matchEnd",
        eventTitle: "호출 취소",
        eventMessage: `${driverName || driverId}님께서 호출을 취소하였습니다.`
      })
    } else if(type === "end") {
      addEvent(customerId, {
        eventType: "matchEnd",
        eventTitle: "운행 종료",
        eventMessage: `${driverName || driverId}님과의 운행이 종료되었습니다.`
      })
    }
  }
}

export default router;