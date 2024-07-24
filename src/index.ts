import express from "express";
import loginController from "./controllers/loginController";
import meController from "./controllers/meController";
import registerController from "./controllers/registerController";
import rootController from "./controllers/rootController";
import authMiddleware from "./middlewares/authMiddleware";
import can from "./middlewares/permissionMiddleware";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", rootController);
app.post("/auth/login", loginController);
app.post("/auth/register", registerController);
app.get("/auth/me", authMiddleware, meController);
app.put(
  "/permissions",
  authMiddleware,
  can("permissions-create"),
  rootController
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
