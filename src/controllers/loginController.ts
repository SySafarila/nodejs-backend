import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import Joi from "joi";
import * as jose from "jose";
import CustomError from "../CustomError";
import JwtPayloadType from "../types/JwtPayloadType";
import LoginType from "../types/LoginType";

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

    const tokenSecret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT({
      user_id: findUser.id,
      randomizer: new Date().getTime(),
    } as JwtPayloadType)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("6 hours")
      .sign(tokenSecret);

    res.json({
      message: "Login success. Your token valid for 6 hours from now",
      token: token,
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
