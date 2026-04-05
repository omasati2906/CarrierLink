import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


const start = async () => {
   try {
      const connectDB = await mongoose.connect(process.env.MONGO_URI);
      const port = process.env.PORT || 9091;

      app.listen(port, () => {
         console.log(`server is running on port ${port}`);
      });
   } catch (error) {
      console.error("Database connection failed:", error.message);
   }
};

app.get("/", (req, res) => {
   res.send("Hello World!");
});


start();