import { PrismaClient } from "@prisma/client";
import { NextFunction, Request } from "express";
import SignedResponseType from "../types/SignedResponseType";
import CustomError from "../utils/CustomError";
import verifyJwt from "../utils/verifyJwt";

const authMiddleware = async (
  req: Request,
  res: SignedResponseType,
  next: NextFunction
) => {
  try {
    const prisma = new PrismaClient();
    const { authorization } = req.headers;
    const jwt = authorization?.split("Bearer ")[1];

    const { payload } = await verifyJwt(jwt!);
    const { user_id } = payload;

    const token = await prisma.token.findFirst({
      where: {
        token_id: payload.token_id,
        is_active: true,
      },
    });

    if (!token) {
      throw new CustomError("Token invalid", 401);
    }

    const rolesAndPermissions = await prisma.user.findFirst({
      where: {
        id: user_id,
      },
      include: {
        roles: {
          select: {
            name: true,
            permissions: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const roles: string[] = [];
    const permissions: string[] = [];

    rolesAndPermissions?.roles.forEach((role) => {
      roles.push(role.name);
      role.permissions.forEach((permission) => {
        permissions.push(permission.name);
      });
    });

    res.locals.jwt = jwt;
    res.locals.user_id = user_id;
    res.locals.permissions = permissions;
    res.locals.roles = roles;

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
