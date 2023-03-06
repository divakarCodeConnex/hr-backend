const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const authRouter = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const auth = require("./middleware/auth");

dotenv.config();

mongoose.connect(process.env.MONGO_URL, () => {
  console.log("MongoDB connected");
});

app.use(auth);

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// Routes
app.use("/auth", authRouter);
app.use("/users", userRoute);
app.use("/posts", postRoute);

app.get("/", (req, res) => {
  res.send("Welcome to HomePage");
});

app.listen(process.env.PORT, console.log("server running"));
