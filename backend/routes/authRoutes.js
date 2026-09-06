import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/authMiddleware.js";
const router = express.Router();
 
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "Citizen"
    });

    res.json({
      message: "User registered successfully"
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({
      message: "Server error"
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({
      message: "Server error"
    });
  }
});

router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ name: 1 });
    res.json(users);
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({
      message: "Server error"
    });
  }
});

router.delete("/users/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Admin access required"
      });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }
     
    if (user.role === "Admin") {
      return res.status(403).json({
        message: "Admin account cannot be deleted"
      });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({
      message: "Citizen account deleted successfully"
    });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({
      message: "Server error"
    });
  }
});
export default router;