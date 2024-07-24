import { NextFunction, Request } from "express";
import SignedResponseType from "../types/SignedResponseType";

const permissionMiddleware = (permission: string) => {
  return async (req: Request, res: SignedResponseType, next: NextFunction) => {
    const checkPermission = res.locals.permissions?.includes(permission);

    if (!checkPermission) {
      res.status(403).json({ message: "You don't have right permission" });
      return;
    }

    next();
  };
};

export default permissionMiddleware;