import path from "path";
import fs from "fs";
import express, { Router } from "express";
import multer from "multer";
import { v4 as uuid } from 'uuid';
import { PrismaClient } from "@prisma/client";

const router = Router();
const upload = multer({
  storage: multer.diskStorage({
    filename(req, file, done) {
      const randomID = uuid();
      const ext = path.extname(file.originalname);
      const filename = randomID + ext;
      done(null, filename);
    },
    destination(req, file, done) {
      const filePath = path.join(__dirname, "../../public", req.params.path);
      if(!fs.existsSync(filePath)) fs.mkdirSync(filePath);
      done(null, filePath);
    },
  }),
});

const prisma = new PrismaClient();

router.use("/view", express.static(path.join(__dirname, "../../public")));

router.post("/upload/:path", upload.single("data"), async (req: PostRequest<any, {filePath: string}>, res: ExpressResponse) => {
  try {
    if(req.session.user !== undefined) {
      if(req.file !== undefined) {
        await prisma.user.update({
          data: {
            image: req.file.filename
          },
          where: {
            id: req.session.user.id
          }
        });
  
        res.status(200).json({ message: "success", action: "reload" });
      } else {
        res.status(400).json({ message: "파일이 없습니다." });
      }
    } else {
      res.status(200).json({ message: "로그인을 먼저 해주세요.", action: "reload" });
    }
  } catch {
    res.status(500).send({ message: "Internal Server Error" })
  }
})

export default router;