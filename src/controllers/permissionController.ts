import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import Joi from "joi";
import CustomError from "../utils/CustomError";

type StoreType = {
  name: string;
};

export const storePermission = async (req: Request, res: Response) => {
  const { name } = req.body as StoreType;
  const prisma = new PrismaClient();
  try {
    const schema: Joi.ObjectSchema<any> = Joi.object({
      name: Joi.string().required(),
    });
    const options: Joi.ValidationOptions = {
      abortEarly: false,
    };

    await schema.validateAsync({ name } as StoreType, options);
    const check = await prisma.permission.findFirst({
      where: {
        name: name,
      },
    });

    if (check) {
      throw new CustomError("Permission already exists", 400);
    }

    const permission = await prisma.permission.create({
      data: {
        name: name,
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
    if (error instanceof Joi.ValidationError) {
      res.status(400).json({
        message: error.message,
      });
      return;
    }

    res.status(400).json({
      message: error.message ?? "Bad request",
    });
    return;
  }
};

type UpdateType = {
  name: string;
  new_name: string;
};

export const updatePermission = async (req: Request, res: Response) => {
  const { name, new_name } = req.body as UpdateType;
  const prisma = new PrismaClient();
  try {
    const schema: Joi.ObjectSchema<any> = Joi.object({
      name: Joi.string().required(),
      new_name: Joi.string().required(),
    });
    const options: Joi.ValidationOptions = {
      abortEarly: false,
    };

    await schema.validateAsync({ name, new_name } as UpdateType, options);
    const check = await prisma.permission.findFirst({
      where: {
        name: name,
      },
    });

    if (!check) {
      throw new CustomError("Permission not found", 404);
    }

    const permission = await prisma.permission.update({
      where: {
        name: name,
      },
      data: {
        name: new_name,
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
    if (error instanceof Joi.ValidationError) {
      res.status(400).json({
        message: error.message,
      });
      return;
    }

    res.status(400).json({
      message: error.message ?? "Bad request",
    });
    return;
  }
};

type DeleteType = {
  name: string;
};

export const deletePermission = async (req: Request, res: Response) => {
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
    const check = await prisma.permission.findFirst({
      where: {
        name: name,
      },
    });

    if (!check) {
      throw new CustomError("Permission not found", 404);
    }

    const permission = await prisma.permission.delete({
      where: {
        name: name,
      },
    });

    res.json({
      message: "Success",
    });
    return;
  } catch (error: any) {
    if (error instanceof Joi.ValidationError) {
      res.status(400).json({
        message: error.message,
      });
      return;
    }

    res.status(400).json({
      message: error.message ?? "Bad request",
    });
    return;
  }
};

export const readPermission = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  try {
    const permissions = await prisma.permission.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.json({
      message: "Success",
      data: permissions,
    });
    return;
  } catch (error: any) {
    if (error instanceof Joi.ValidationError) {
      res.status(400).json({
        message: error.message,
      });
      return;
    }

    res.status(400).json({
      message: error.message ?? "Bad request",
    });
    return;
  }
};
