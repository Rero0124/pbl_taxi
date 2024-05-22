import { PrismaClient } from "@prisma/client";
import express, { Router } from "express";
import { callSendDriver, matchSend } from "./message";
import { SessionUser } from "../types/session";

const router: Router = express.Router();
const prisma = new PrismaClient();

const calledUsers = new Map<string, {user: SessionUser, address: MatchAddress}>();

const query = (x: string, y: string, inward: boolean, quickly: boolean, song: boolean) => `
SELECT 
  "name",
  "phone",
  "image",
  "userId",
  "geom",
  "distance",
  "inward",
  "quickly",
  "song",
  "songName",
  "score",
  "point"
FROM 
  (
    SELECT
      usr."name",
      usr."phone",
      usr."image",
      loc."userId",
      st_astext(loc."geom") AS "geom",
      loc."distance",
      coalesce(ten."inward", false) AS "inward",
      coalesce(ten."quickly", false) AS "quickly",
      coalesce(ten."song", false) AS "song",
      ten."songName",
      CASE WHEN rate."score" is NULL THEN 0 ELSE rate."score" END AS "score",
      (CASE WHEN ten."inward" = ${inward} THEN 2 WHEN ten."inward" IS NULL THEN 1 ELSE 0 END) 
      + (CASE WHEN ten."quickly" = ${quickly} THEN 2 WHEN ten."quickly" IS NULL THEN 1 ELSE 0 END) 
      + (CASE WHEN ten."song" = ${song} THEN 2 WHEN ten."song" IS NULL THEN 1 ELSE 0 END) 
      + ((CASE WHEN rate."score" IS NULL THEN 4 ELSE rate."score" END) - 2) * 3 AS "point"
    FROM
      (
        SELECT 
          b."userId", 
          b."geom",
          st_distance(st_transform(b."geom", 3857), geom_3857) AS distance
        FROM 
          "UserLocate" b, 
          (
            SELECT 
              ST_GeomFromText('POINT(${x} ${y})', 4326) AS "geom",
              st_transform(ST_GeomFromText('POINT(${x} ${y})', 4326), 3857) AS "geom_3857"
          ) w 
        WHERE st_dwithin(w."geom_3857", st_transform(b."geom", 3857), 3000)
        AND b."updateAt" > NOW() - INTERVAL '10 MINUTE'
      ) loc
      LEFT OUTER JOIN "UserTendency" AS ten
        ON loc."userId" = ten."userId"
      LEFT JOIN "User" AS usr
        ON loc."userId" = usr."id",
      LATERAL (
        SELECT AVG(r."score") AS score from "UserRate" r WHERE r."userId" = loc."userId"
      ) AS rate
  ) AS result
  ORDER BY "point", "distance"
  LIMIT 100`;

/**
 * 근처에 있는 택시기사 검색
 */
router.get('/tendency', async (req: GetRequest<{}, LocateQuery>, res: ExpressResponse) => {
  try{
    if(req.session.user !== undefined) {
      const result = await prisma.$queryRawUnsafe<SearchResult>(query(req.query.x, req.query.y, req.session.user.inward, req.session.user.quickly, req.session.user.song));
      res.status(200).json({ message: "success", data: result });
    } else {
      res.status(200).json({ message: "로그인을 먼저 해주세요.", action: "reload" });
    }
  } catch {
    res.status(500).send({ message: "Internal Server Error" })
  }
})

router.get('/speed', async (req: GetRequest<{}, LocateQuery>, res: ExpressResponse) => {
  try{
    if(req.session.user !== undefined) {
      const result = await prisma.$queryRawUnsafe<SearchResult>(query(req.query.x, req.query.y, req.session.user.inward, req.session.user.quickly, req.session.user.song));
      res.status(200).json({ message: "success", data: result });
    } else {
      res.status(200).json({ message: "로그인을 먼저 해주세요.", action: "reload" });
    }
  } catch {
    res.status(500).send({ message: "Internal Server Error" })
  }
})

router.post('/match/driver', async (req: PostRequest<MatchDriverBody>, res: ExpressResponse) => {
  try{
    if(req.session.user !== undefined) {
      calledUsers.set(req.session.user.id, {user: req.session.user, address: req.body.address});
      callSendDriver(req.session.user, req.body.driverId, req.body.address);
      res.status(200).json({ message: "success" });
    } else {
      res.status(200).json({ message: "로그인을 먼저 해주세요.", action: "reload" });
    }
  } catch {
    res.status(500).send({ message: "Internal Server Error" })
  }
})

router.delete('/match/driver', async (req: DeleteRequest, res: ExpressResponse) => {
  try{
    if(req.session.user !== undefined) {
      calledUsers.delete(req.session.user.id);
      res.status(200).json({ message: "success" });
    } else {
      res.status(200).json({ message: "로그인을 먼저 해주세요.", action: "reload" });
    }
  } catch {
    res.status(500).send({ message: "Internal Server Error" })
  }
})

router.post('/match/customer', async (req: PostRequest<{customerId: string}>, res: ExpressResponse) => {
  try{
    if(req.session.user !== undefined) {
      const customer = calledUsers.get(req.body.customerId);
      if(customer) {
        calledUsers.delete(req.body.customerId);
        matchSend(customer.user, req.session.user, customer.address);
        res.status(200).json({ message: "success" });
      } else {
        res.status(200).json({ message: "fail" });
      }
    } else {
      res.status(200).json({ message: "로그인을 먼저 해주세요.", action: "reload" });
    }
  } catch {
    res.status(500).send({ message: "Internal Server Error" })
  }
})

export default router;
