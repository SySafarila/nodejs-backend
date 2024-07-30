import express from "express";
import rootController from "./controllers/rootController";
import auth from "./routes/auth";
import permissions from "./routes/permissions";

const app = express();
const port = process.env.APP_PORT ?? 3000;

app.use(express.json());

app.get("/", rootController);
app.use(auth);
app.use(permissions);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
