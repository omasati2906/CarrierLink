import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";


import postsRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(postsRoutes);
app.use(userRoutes);

app.use(express.static("uploads"));




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