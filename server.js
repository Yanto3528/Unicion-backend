const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");
const socket = require("./socket");
const helmet = require("helmet");

dotenv.config({ path: "./config/config.env" });

const posts = require("./routes/posts");
const users = require("./routes/users");
const comments = require("./routes/comments");
const profiles = require("./routes/profiles");
const notifications = require("./routes/notifications");

connectDB();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors());

app.use("/api/posts", posts);
app.use("/api/users", users);
app.use("/api/comments", comments);
app.use("/api/profiles", profiles);
app.use("/api/notifications", notifications);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server has started on port ${PORT}`)
);
socket.init(server);
