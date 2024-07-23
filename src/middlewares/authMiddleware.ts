import { PrismaClient } from "@prisma/client";
import { NextFunction, Request } from "express";
import ResponseType from "../types/ResponseType";
import CustomError from "../utils/CustomError";
import verifyJwt from "../utils/verifyJwt";

const authMiddleware = async (
  req: Request,
  res: ResponseType,
  next: NextFunction
) => {
  try {
    const prisma = new PrismaClient();
    const { authorization } = req.headers;
    const jwt = authorization?.split("Bearer ")[1];

    const { payload } = await verifyJwt(jwt!);

    const token = await prisma.token.findFirst({
      where: {
        token_id: payload.token_id,
        is_active: true,
      },
    });

    if (!token) {
      throw new CustomError("Token invalid", 401);
    }

    res.locals.jwt = jwt;

    // set correct permissions array to locals variable

    return next();
  } catch (error: any) {
    if (error instanceof CustomError) {
      res.status(error.code).json({
        message: error.message,
      });
      return;
    }
    res.status(400).json({
      message: error.message ?? "Bad request",
    });
  }
};

export default authMiddleware;
