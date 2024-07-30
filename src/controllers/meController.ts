import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import SignedResponseType from "../types/SignedResponseType";
import errorHandler from "../utils/errorHandler";
import CustomError from "../utils/CustomError";

const meController = async (req: Request, res: SignedResponseType) => {
  const prisma = new PrismaClient();
  const { user_id } = res.locals;

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    res.json({
      message: "Success",
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        verified_at: user?.verified_at,
        updated_at: user?.updated_at,
        created_at: user?.created_at,
      },
    });
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    });
  }
};

export default meController;
