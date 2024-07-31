import express from "express";
import rootController from "./controllers/rootController";
import auth from "./routes/auth";
import permissions from "./routes/permissions";

const app = express();

app.use(express.json());

app.get("/", rootController);
app.use(auth);
app.use(permissions);

export default app;
