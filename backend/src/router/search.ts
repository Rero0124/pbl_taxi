import { PrismaClient } from "@prisma/client";
import express, { Router } from "express";

const router: Router = express.Router();
const prisma = new PrismaClient();

router.get('/', (req, res) => {
  
})

export default router;
