import express from "express";
import {
  deletePermission,
  readPermission,
  storePermission,
  updatePermission,
} from "../controllers/permissionController";
import authMiddleware from "../middlewares/authMiddleware";
import can from "../middlewares/permissionMiddleware";

const router = express.Router();

router.put(
  "/permissions",
  authMiddleware,
  can("permissions-create"),
  storePermission
);
router.patch(
  "/permissions",
  authMiddleware,
  can("permissions-update"),
  updatePermission
);
router.delete(
  "/permissions",
  authMiddleware,
  can("permissions-delete"),
  deletePermission
);
router.get(
  "/permissions",
  authMiddleware,
  can("permissions-read"),
  readPermission
);

export default router;
