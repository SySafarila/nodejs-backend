import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import SignedResponseType from "../types/SignedResponseType";
import CustomError from "../utils/CustomError";
import errorHandler from "../utils/errorHandler";

const logoutController = async (req: Request, res: SignedResponseType) => {
  const { token_id } = res.locals;
  const prisma = new PrismaClient();

  try {
    const findToken = await prisma.token.findFirst({
      where: {
        token_id: token_id,
      },
    });

    if (!findToken) {
      throw new CustomError("Token not found", 404);
    }

    await prisma.token.update({
      where: {
        id: findToken.id,
      },
      data: {
        is_active: false,
      },
    });

    res.json({
      message: "Logout success",
    });
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    });
  }
};

export default logoutController;
