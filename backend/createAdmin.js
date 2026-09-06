import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";
dotenv.config();
const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
        const existingAdmin = await User.findOne({
            email: "admin@citisolve.com"
        });
        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit();
        }
        const hashedPassword = await bcrypt.hash(
            "Citisolve123",
            10
        );
        const admin = await User.create({
            name: "CitiSolve Admin",
            email: "admin@citisolve.com",
            password: hashedPassword,
            role: "Admin"
        });
        console.log("Admin created successfully!");
        console.log("Admin Email:", admin.email);
        console.log("Admin Role:", admin.role);
        process.exit();
    } catch (error) {
        console.error("Admin creation error:", error);
        process.exit(1);
    }
};
createAdmin();