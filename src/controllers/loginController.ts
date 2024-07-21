import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import Joi from "joi";
import CustomError from "../CustomError";
import LoginType from "../types/LoginType";

const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginType;
  const prisma = new PrismaClient();

  try {
    const schema: Joi.ObjectSchema<any> = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8),
    });
    const options: Joi.ValidationOptions = {
      abortEarly: false,
    };

    await schema.validateAsync({ email, password } as LoginType, options);

    const checkEmail = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!checkEmail) {
      // throw new Error("User not found");
      throw new CustomError("User not found", 404);
    }

    const comparePassword = "";
    if (checkEmail.password != comparePassword) {
      // throw new Error("Credentials not match");
      throw new CustomError("Credentials not match", 401);
    }

    res.json({
      message: "Hello from Express Typescript",
    });
  } catch (error: any) {
    if (error instanceof Joi.ValidationError) {
      res.status(400).json({
        message: error.message,
      });
      return;
    }

    if (error instanceof CustomError) {
      res.status(error.code).json({
        message: error.message,
      });
      return;
    }

    res.status(400).json({
      message: "Bad request",
    });
  }
};

export default loginController;
