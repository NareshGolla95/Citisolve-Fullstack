import express from "express";
import multer from "multer";
import Complaint from "../models/Complaint.js";
import auth from "../middleware/authMiddleware.js";
const router = express.Router();
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  }
});
const upload = multer({ storage });
router.post(
  "/",
  auth,
  upload.single("photo"),
  async (req, res) => {
    try {
      const complaint = await Complaint.create({
        user: req.user.id,
        ward: req.body.ward,
        location: req.body.location,
        category: req.body.category,
        description: req.body.description,
        photo: req.file
          ? req.file.filename
          : null
      });
      res.json({
        message: "Complaint submitted",
        complaint
      });
    } catch (err) {
      console.error("COMPLAINT ERROR:", err);
      res.status(500).json({
        message: "Server error"
      });
    }
  }
);

router.get(
  "/my",
  auth,
  async (req, res) => {
    try {
      const complaints = await Complaint
        .find({
          user: req.user.id
        })
        .populate(
          "user",
          "name email role"
        )
        .sort({
          createdAt: -1
        });
      res.json(complaints);
    } catch (err) {
      console.error(
        "MY COMPLAINTS ERROR:",
        err
      );
      res.status(500).json({
        message: "Server error"
      });
    }
  }
);

router.get(
  "/all",
  auth,
  async (req, res) => {
    try {
      const complaints = await Complaint
        .find()
        .populate(
          "user",
          "name email role"
        )
        .sort({
          createdAt: -1
        });
      res.json(complaints);
    } catch (err) {
      console.error(
        "ALL COMPLAINTS ERROR:",
        err
      );
      res.status(500).json({
        message: "Server error"
      });
    }
  }
);

router.put(
  "/:id/status",
  auth,
  async (req, res) => {
    try {
      const { status } = req.body;
      const allowedStatus = [
        "Pending",
        "In Progress",
        "Completed"
      ];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status"
        });
      }
      const complaint =
        await Complaint.findByIdAndUpdate(
          req.params.id,
          {
            status: status
          },
          {
            new: true
          }
        );
      if (!complaint) {
        return res.status(404).json({
          message: "Complaint not found"
        });
      }
      res.json({
        message:
          "Complaint status updated successfully",
        complaint
      });
    } catch (err) {
      console.error(
        "STATUS UPDATE ERROR:",
        err
      );
      res.status(500).json({
        message: "Server error"
      });
    }
  }
);

router.delete(
  "/:id",
  auth,
  async (req, res) => {
    try {
      const complaint =
        await Complaint.findByIdAndDelete(
          req.params.id
        );
      if (!complaint) {
        return res.status(404).json({
          message: "Complaint not found"
        });
      }
      res.json({
        message: "Complaint deleted"
      });
    } catch (err) {
      console.error(
        "DELETE ERROR:",
        err
      );
      res.status(500).json({
        message: "Server error"
      });
    }
  }
);
export default router;