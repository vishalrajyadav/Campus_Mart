import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import connectDB from "./config/connectDB.js";
import userRouter from "./routes/userRoute.js";
import blogRouter from "./routes/blogRoute.js";
import commentRouter from "./routes/commentRoute.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

// ---------------- CONFIG ----------------
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();
const __dirname = path.resolve();

// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// ---------------- ROUTES ----------------
app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);
app.use("/api/comment", commentRouter);

// ---------------- FRONTEND BUILD ----------------
app.use(express.static(path.join(__dirname, "client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// ---------------- ERROR HANDLER ----------------
app.use(errorMiddleware);

// ---------------- SERVER START ----------------
const startServer = async () => {
  try {
    await connectDB(MONGO_URI);
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server start failed:", error.message);
  }
};

startServer();
