import { Request, Response } from "express";
import Joi from "joi";
import LoginType from "../types/LoginType";

const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginType;

  try {
    const schema: Joi.ObjectSchema<any> = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8),
    });
    const options: Joi.ValidationOptions = {
      abortEarly: false,
    };

    await schema.validateAsync({ email, password } as LoginType, options);

    res.json({
      message: "Hello from Express Typescript",
    });
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      res.status(400).json({
        message: error.message,
      });
    }

    res.status(400).json({
      message: "Bad request",
    });
  }
};

export default loginController;
