import express from "express";
import loginController from "./controllers/loginController";
import registerController from "./controllers/registerController";
import rootController from "./controllers/rootController";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", rootController);
app.post("/auth/login", loginController);
app.post("/auth/register", registerController);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
