import express from "express";
import rootController from "./controllers/rootController";
import loginController from "./controllers/loginController";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", rootController);
app.post("/auth/login", loginController);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
