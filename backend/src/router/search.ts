import { PrismaClient } from "@prisma/client";
import express, { Router } from "express";

const router: Router = express.Router();
const prisma = new PrismaClient();

interface UserLocateAndTendency {
  userId: string,
  geom: string,
  distance: number,
  inward: boolean,
  quickly: boolean,
  song: boolean,
  songName: string | null
}


/**
 * 근처에 있는 택시기사 검색
 */
router.get('/near/user/:id/locate', async (req: GetRequest<UserIdParam, LocateBody>, res: ExpressResponse) => {
  try{
    const result = await prisma.$queryRawUnsafe<UserLocateAndTendency>(`
                      SELECT 
                        *
                      FROM 
                        (
                          SELECT
                            loc."userId",
                            st_astext(loc."geom") AS "geom",
                            loc."distance",
                            coalesce(ten."inward", false) AS "inward",
                            coalesce(ten."quickly", false) AS "quickly",
                            coalesce(ten."song", false) AS "song",
                            ten."songName"
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
                                    ST_GeomFromText('POINT(${req.query.x} ${req.query.y})', 4326) AS "geom",
                                    st_transform(ST_GeomFromText('POINT(${req.query.x} ${req.query.y})', 4326), 3857) AS "geom_3857"
                                ) w 
                              WHERE 
                                not b."userId" = '${req.params.id}' 
                                AND st_dwithin(w."geom_3857", st_transform(b."geom", 3857), 1500)
                            ) loc
                            LEFT OUTER JOIN "UserTendency" AS ten
                              ON loc."userId" = ten."userId"
                        ) AS result`);

    res.status(200).json(result);
  } catch {
    res.status(500).send("Internal Server Error")
  }
})

export default router;
