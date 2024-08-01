import express from "express";
import rootController from "./controllers/rootController";
import auth from "./routes/auth";
import permissions from "./routes/permissions";
import roles from "./routes/roles";

const app = express();

app.use(express.json());

app.get("/", rootController);
app.use(auth);
app.use(permissions);
app.use(roles);

export default app;
