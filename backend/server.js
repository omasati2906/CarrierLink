import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


import postsRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";


dotenv.config();

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
   fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(postsRoutes);
app.use(userRoutes);

app.use(express.static(path.join(__dirname, "uploads")));




const start = async () => {
   try {
      const connectDB = await mongoose.connect(process.env.MONGO_URI);
      const port = process.env.PORT || 9090;

      app.listen(port, () => {
         console.log(`server is running on port ${port}`);
      });
   } catch (error) {
      console.error("Database connection failed:", error.message);
   }
};



start();