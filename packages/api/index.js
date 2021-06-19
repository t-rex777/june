import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { config } from "dotenv";
config();

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

// middlewares
app.use(bodyParser.json());
app.use(cors());

// mongoose connection
mongoose
  .connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(console.log("DB CONNECTED!!!!!!!!!!!"))
  .catch((err) => console.log(err));

// routes

// api

app.get("/", (req, res) => {
  res.send("hello world!");
});

// listen
app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
