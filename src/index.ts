import express from "express";
import rootController from "./controllers/rootController";

const app = express();
const port = 3000;

app.get("/", rootController);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
