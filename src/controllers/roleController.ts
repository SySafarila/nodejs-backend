import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import Joi from "joi";
import CustomError from "../utils/CustomError";
import errorHandler from "../utils/errorHandler";

type StoreType = {
  name: string;
  level: number;
};

export const storeRole = async (req: Request, res: Response) => {
  const { name, level } = req.body as StoreType;
  const prisma = new PrismaClient();
  try {
    const schema: Joi.ObjectSchema<any> = Joi.object({
      name: Joi.string().required(),
      level: Joi.number().required(),
    });
    const options: Joi.ValidationOptions = {
      abortEarly: false,
    };

    await schema.validateAsync({ name, level } as StoreType, options);
    const check = await prisma.role.findFirst({
      where: {
        name: name,
      },
    });

    if (check) {
      throw new CustomError("Role already exists", 400);
    }

    const role = await prisma.role.create({
      data: {
        name: name,
        level: level,
      },
    });

    res.json({
      message: "Success",
      data: {
        id: role.id,
        name: role.name,
        level: role.level,
        created_at: role.created_at,
        updated_at: role.updated_at,
      },
    });
    return;
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    });
  }
};

type UpdateType = {
  name: string;
  new_name?: string;
  new_level?: number;
};

export const updateRole = async (req: Request, res: Response) => {
  const { name, new_name, new_level } = req.body as UpdateType;
  const prisma = new PrismaClient();
  try {
    const schema: Joi.ObjectSchema<any> = Joi.object({
      name: Joi.string().required(),
      new_name: Joi.string().optional().max(255),
      new_level: Joi.number().optional(),
    });
    const options: Joi.ValidationOptions = {
      abortEarly: false,
    };

    await schema.validateAsync(
      { name, new_name, new_level } as UpdateType,
      options
    );
    const check = await prisma.role.findFirst({
      where: {
        name: name,
      },
    });

    if (!check) {
      throw new CustomError("Role not found", 404);
    }

    const role = await prisma.role.update({
      where: {
        name: name,
      },
      data: {
        name: new_name ?? check.name,
        level: new_level ?? check.level,
      },
    });

    res.json({
      message: "Success",
      data: {
        id: role.id,
        name: role.name,
        level: role.level,
        created_at: role.created_at,
        updated_at: role.updated_at,
      },
    });
    return;
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    });
  }
};

type DeleteType = {
  name: string;
};

export const deleteRole = async (req: Request, res: Response) => {
  const { name } = req.body as DeleteType;
  const prisma = new PrismaClient();
  try {
    const schema: Joi.ObjectSchema<any> = Joi.object({
      name: Joi.string().required(),
    });
    const options: Joi.ValidationOptions = {
      abortEarly: false,
    };

    await schema.validateAsync({ name } as DeleteType, options);
    const check = await prisma.role.findFirst({
      where: {
        name: name,
      },
    });

    if (!check) {
      throw new CustomError("Role not found", 404);
    }

    await prisma.role.delete({
      where: {
        name: name,
      },
    });

    res.json({
      message: "Success",
    });
    return;
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    });
  }
};

export const readRole = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  try {
    const roles = await prisma.role.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.json({
      message: "Success",
      data: roles,
    });
    return;
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    });
  }
};
