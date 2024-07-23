import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import Joi from "joi";
import CustomError from "../utils/CustomError";
import LoginType from "../types/LoginType";
import signJwt from "../utils/signJwt";

const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginType;
  const prisma = new PrismaClient();

  try {
    const schema: Joi.ObjectSchema<any> = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    });
    const options: Joi.ValidationOptions = {
      abortEarly: false,
    };

    await schema.validateAsync({ email, password } as LoginType, options);

    const findUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!findUser) {
      throw new CustomError("User not found", 404);
    }

    const comparePassword: boolean = await bcrypt.compare(
      password,
      findUser.password
    );
    if (!comparePassword) {
      throw new CustomError("Credentials not match", 401);
    }

    const token = await signJwt(findUser.id);

    await prisma.token.create({
      data: {
        token_id: token.payload.token_id,
        users: {
          connect: {
            id: findUser.id,
          },
        },
      },
    });

    res.json({
      message: "Login success. Your token valid for 6 hours from now",
      token: token.token,
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
