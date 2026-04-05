

import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Profile from "../models/profile.model.js";
import Connections from "../models/connections.model.js";


import crypto from "crypto";
import { response } from "express";

import PDFDocument from "pdfkit";
import fs from "fs";



const converUserDataToPDF = async (userProfile) => {
   return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
      const stream = fs.createWriteStream("./uploads/" + outputPath);
      doc.pipe(stream);

      // Profile Picture (Top Right)
      const picturePath = `./uploads/${userProfile.userId.profilePicture}`;
      if (userProfile.userId.profilePicture && fs.existsSync(picturePath)) {
         doc.image(picturePath, 450, 50, { width: 100 });
      }

      // Header Info
      doc.fontSize(26).text(userProfile.userId.name, { underline: true });
      doc.fontSize(12).text(`Email: ${userProfile.userId.email}`, { characterSpacing: 1 });
      doc.moveDown();

      // Bio Section
      if (userProfile.bio) {
         doc.fontSize(16).text("Bio", { underline: true });
         doc.fontSize(12).text(userProfile.bio);
         doc.moveDown();
      }

      // Current Post
      if (userProfile.currentPost) {
         doc.fontSize(16).text("Current Position", { underline: true });
         doc.fontSize(12).text(userProfile.currentPost);
         doc.moveDown();
      }

      // Past Work Section
      if (userProfile.pastWork && userProfile.pastWork.length > 0) {
         doc.fontSize(16).text("Professional Experience", { underline: true });
         userProfile.pastWork.forEach((work) => {
            doc.moveDown(0.5);
            doc.fontSize(14).text(`${work.position} at ${work.company}`, { indent: 10 });
            doc.fontSize(12).text(`Duration: ${work.years}`, { indent: 20 });
         });
         doc.moveDown();
      }

      // Education Section
      if (userProfile.education && userProfile.education.length > 0) {
         doc.fontSize(16).text("Education", { underline: true });
         userProfile.education.forEach((edu) => {
            doc.moveDown(0.5);
            doc.fontSize(14).text(`${edu.degree} in ${edu.fieldOfStudy}`, { indent: 10 });
            doc.fontSize(12).text(`${edu.school}`, { indent: 20 });
         });
      }

      doc.end();

      stream.on('finish', () => {
         resolve(outputPath);
      });

      stream.on('error', (err) => {
         reject(err);
      });
   });
};



export const register = async (req, res) => {

   console.log(req.body);
   try {
      const { name, username, email, password } = req.body;

      if (!name || !username || !email || !password) {
         return res.status(400).json({ message: "All fields are required" })
      }

      const user = await User.findOne({ email });
      if (user) {
         return res.status(400).json({ message: "User already exists" })
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
         name,
         username,
         email,
         password: hashedPassword
      });

      await newUser.save();

      const profile = new Profile({
         userId: newUser._id,
         bio: "",
         currentPost: "",
         pastWork: [],
         education: []
      });
      await profile.save();
      return res.status(200).json({ message: "User registered successfully" })



   } catch (error) {
      return res.status(500).json({ message: error.message })
   }
}

export const login = async (req, res) => {
   try {
      const { email, password } = req.body;
      if (!email || !password) {
         return res.status(400).json({ message: "All fields are required" })
      }
      const user = await User.findOne({ email });

      if (!user) {
         return res.status(404).json({ message: "User not found" })
      }

      console.log("Login attempt for:", user.email, "Matched User ID:", user._id, "Name:", user.name);

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
         return res.status(400).json({ message: "Invalid password" })
      }

      const token = crypto.randomBytes(32).toString("hex");

      await User.updateOne({ _id: user._id }, { $set: { token } });
      console.log("Token updated for user:", user._id);

      return res.status(200).json({ message: "User logged in successfully", token })



   } catch (error) {
      return res.status(500).json({ message: error.message })
   }
}


export const uploadProfilePicture = async (req, res) => {
   const { token } = req.body;
   try {

      const user = await User.findOne({ token });
      if (!user) {
         return res.status(404).json({ message: "User not found" })
      }

      user.profilePicture = req.file.path;   // Cloudinary returns full URL in req.file.path
      await user.save();
      return res.status(200).json({ message: "Profile picture updated successfully" })

   } catch (error) {
      return res.status(500).json({ message: error.message })
   }
}


export const updateUserProfile = async (req, res) => {
   try {

      const { token, ...newUserData } = req.body;   //all the information about user is stored in newuserdata

      const user = await User.findOne({ token });
      if (!user) {
         return res.status(404).json({ message: "User not found" })
      }

      const { username, email } = newUserData;


      const existingUser = await User.findOne({
         $or: [{ username }, { email }]
      })

      if (existingUser) {
         if (existingUser || String(existingUser._id) !== String(user._id)) {
            return res.status(500).json({ message: "User already exists" })
         }
      }

      Object.assign(user, newUserData);   //update the user data
      await user.save();
      return res.status(200).json({ message: "User updated successfully" })

   } catch (error) {
      return res.status(500).json({ message: error.message })
   }



}


export const getUserProfile = async (req, res) => {

   const { token } = req.query;
   try {

      if (!token) {
         return res.status(400).json({ message: "Token is required" })
      }

      const user = await User.findOne({ token: token.trim() });
      if (!user) {
         console.log("User not found for token:", token);
         return res.status(404).json({ message: "User not found" })
      }

      console.log("User found:", user._id, user.name, user.email);

      let userProfile = await Profile.findOne({ userId: user._id }).populate('userId', 'name username email profilePicture')

      if (!userProfile) {
         console.log("Profile not found, creating default for user:", user._id);
         userProfile = new Profile({
            userId: user._id,
            bio: "",
            currentPost: "",
            pastWork: [],
            education: []
         });
         await userProfile.save();
         // Fetch again to ensure population works
         userProfile = await Profile.findOne({ userId: user._id }).populate('userId', 'name username email profilePicture')
      }

      return res.json({ profile: userProfile })

   }
   catch (error) {
      return res.status(500).json({ message: error.message })
   }
}

export const udpdateProfileData = async (req, res) => {
   try {
      const { token, ...newProfileData } = req.body;
      const user = await User.findOne({ token });

      if (!user) {
         return res.status(404).json({ message: "User not found" })
      }

      const profile_to_update = await Profile.findOne({ userId: user._id });
      if (!profile_to_update) {
         return res.status(404).json({ message: "Profile not found" })
      }

      Object.assign(profile_to_update, newProfileData);
      await profile_to_update.save();

      return res.status(200).json(profile_to_update)
   } catch (error) {
      return res.status(500).json({ message: error.message })
   }
}

export const getAllUserProfile = async (req, res) => {
   try {
      const users = await Profile.find().populate('userId', 'name username email profilePicture');
      return res.status(200).json(users.reverse())
   } catch (error) {
      return res.status(500).json({ message: error.message })
   }
}

export const downloadProfile = async (req, res) => {
   try {

      const user_id = req.params.id;   //  yaha hum token se nhi kr skte kyuki token private hote hai hum duro ka resume download krnle ke liye user_id ka use krte hai

      const userProfile = await Profile.findOne({ userId: user_id }).populate('userId', 'name email profilePicture');

      let outputPath = await converUserDataToPDF(userProfile);


      res.download(`./uploads/${outputPath}`, `${userProfile.userId.name}_resume.pdf`, (err) => {
         // Auto-delete the file after the download stream finishes or fails
         fs.unlink(`./uploads/${outputPath}`, (unlinkErr) => {
            if (unlinkErr) console.error("Error deleting PDF file:", unlinkErr);
         });
      });


   } catch (error) {
      return res.status(500).json({ message: error.message })
   }
}

export const sendConnectionRequest = async (req, res) => {

   const { token, connectionId } = req.body;
   try {

      const user = await User.findOne({ token });
      if (!user) {
         return res.status(404).json({ message: "User not found" })
      }

      const connectionUser = await User.findOne({ _id: connectionId });
      if (!connectionUser) {
         return res.status(404).json({ message: "Connection not found" })
      }

      const existingRequest1 = await Connections.findOne({ userId: user._id, connectionId: connectionUser._id });
      const existingRequest2 = await Connections.findOne({ userId: connectionUser._id, connectionId: user._id });

      if (existingRequest1 || existingRequest2) {
         return res.status(400).json({ message: "Request already exists" })
      }

      const newConnection = new Connections({
         userId: user._id,
         connectionId: connectionUser._id
      });
      await newConnection.save();
      return res.status(200).json({ message: "Connection request sent successfully" })

   } catch (error) {
      return res.status(500).json({ message: error.message })
   }
}


export const ToWhomIHaveSentConnectionRequests = async (req, res) => {   // user ne jinhe bhi req bheja hai unki list

   const { token } = req.query;
   try {

      const user = await User.findOne({ token });
      if (!user) {
         return res.status(404).json({ message: "User not found" })
      }

      const rawConnections = await Connections.find({ 
         $or: [
            { userId: user._id },
            { connectionId: user._id, status_accepted: true }
         ]
       }).populate('userId', 'name username email profilePicture').populate('connectionId', 'name username email profilePicture');
      
      const connections = rawConnections.map(conn => {
         if(conn.connectionId && conn.connectionId._id.toString() === user._id.toString()){
            // I am the connectionId, so the OTHER user is userId. We swap them in the response so frontend always sees other user as connectionId.
            return {
               ...conn.toObject(),
               connectionId: conn.userId,
               userId: conn.connectionId
            }
         }
         return conn;
      });

      return res.status(200).json(connections)

   } catch (error) {
      return res.status(500).json({ message: error.message })
   }
}

export const WhoSentMeConnectionRequests = async (req, res) => {   //user ko jisne bhi req bheja hai unki list

   const { token } = req.query;
   try {

      const user = await User.findOne({ token });
      if (!user) {
         return res.status(404).json({ message: "User not found" })
      }

      const connections = await Connections.find({ connectionId: user._id }).populate('userId', 'name username email profilePicture');
      return res.status(200).json(connections)

   } catch (error) {
      return res.status(500).json({ message: error.message })
   }
}


export const acceptConnectionRequest = async (req, res) => {

   const { token, connection_id, action_type } = req.body;
   try {

      const user = await User.findOne({ token });
      if (!user) {
         return res.status(404).json({ message: "User not found" })
      }

      const connection = await Connections.findOne({ userId: connection_id, connectionId: user._id });

      if (!connection) {
         return res.status(404).json({ message: "Connection not found" })
      }

      if (String(connection.connectionId) !== String(user._id)) {
         return res.status(401).json({ message: "You are not authorized to accept this request" })
      }

      if (action_type === "accept") {
         connection.status_accepted = true;
         await connection.save();
         return res.status(200).json({ message: "Connection request accepted successfully" })
      }
      else if (action_type === "reject") {
         await connection.deleteOne();
         return res.status(200).json({ message: "Connection request rejected successfully" })
      }

   } catch (error) {
      return res.status(500).json({ message: error.message })
   }
}

export const getUserProfileAndUserBasedOnUsername = async (req, res) => {

   const { username } = req.query;
   try {
      const user = await User.findOne({ username });
      if (!user) {
         return res.status(404).json({ message: "User not found" })
      }
      const userProfile = await Profile.findOne({ userId: user._id }).populate('userId', 'name username email profilePicture');
      return res.status(200).json({ "profile": userProfile })
   } catch (error) {
      return res.status(500).json({ message: error.message })
   }
}

export const findConnections = async (req, res) => {
   const { token } = req.query;
   try {
      const user = await User.findOne({ token });
      if (!user) {
         return res.status(404).json({ message: "User not found" })
      }
      
      const rawConnections = await Connections.find({ 
         $or: [
            { userId: user._id, status_accepted: true }, 
            { connectionId: user._id, status_accepted: true }
         ] 
      }).populate('connectionId', 'name username email profilePicture').populate('userId', 'name username email profilePicture');
      
      const connections = rawConnections.map(conn => {
         if (conn.connectionId && conn.connectionId._id.toString() === user._id.toString()) {
            // I am the connectionId, so the OTHER user is userId. We swap them.
            return {
               ...conn.toObject(),
               connectionId: conn.userId,
               userId: conn.connectionId
            }
         }
         return conn;
      });

      return res.status(200).json(connections.reverse())
   } catch (error) {
      return res.status(500).json({ message: error.message })
   }
}