import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import CustomError from "../utils/CustomError";

export const storePermission = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  try {
    const check = await prisma.permission.findFirst({
      where: {
        name: req.body.name,
      },
    });

    if (check) {
      throw new CustomError("Permission already exists", 400);
    }

    const permission = await prisma.permission.create({
      data: {
        name: req.body.name,
      },
    });

    res.json({
      message: "Success",
      data: {
        id: permission.id,
        name: permission.name,
        created_at: permission.created_at,
        updated_at: permission.updated_at,
      },
    });
    return;
  } catch (error: any) {
    res.status(400).json({
      message: error.message ?? "Bad request",
    });
    return;
  }
};
