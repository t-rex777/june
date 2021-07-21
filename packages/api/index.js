require("dotenv").config();
const { setupGoogleOauth } = require("./controllers/auth");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const app = express();
const PORT = process.env.PORT || 4000;

setupGoogleOauth(passport);

// middlewares
const CORS_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:5000",
  "https://furikaeru.sambitsahoo.com",
];

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: [...CORS_ORIGINS],
    credentials: true,
    preflightContinue: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// mongoose connection
mongoose
  .connect(process.env.URI, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
  })
  .then(console.log("DB CONNECTED!!!!!!!!!!!"))
  .catch((err) => console.log(err));

// routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

// api
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", postRoutes);

app.get("/", (req, res) => {
  res.send("hello world!");
});

// listen
app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
