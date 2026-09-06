import mongoose from "mongoose";
const complaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  ward: String,
  location: String,
  category: String,
  description: String,
  photo: String,
  status: {
    type: String,
    default: "Pending"
  }
}, { timestamps: true });
export default mongoose.model("Complaint", complaintSchema);