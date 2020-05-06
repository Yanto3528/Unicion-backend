const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");
const path = require("path");

dotenv.config({ path: "./config/config.env" });

const posts = require("./routes/posts");
const users = require("./routes/users");
const comments = require("./routes/comments");
const profiles = require("./routes/profiles");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "uploads", "images")));

app.use("/api/posts", posts);
app.use("/api/users", users);
app.use("/api/comments", comments);
app.use("/api/profiles", profiles);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
