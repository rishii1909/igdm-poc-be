import mongoose, { Schema, Types } from "mongoose";

const InstaListSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
    },
    outReachProfiles: [
      {
        type: Types.ObjectId,
        ref: "Profile",
      },
    ],
    reachedOutProfiles: [
      {
        type: Types.ObjectId,
        ref: "Profile",
      },
    ],
    timezone: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    outReachHour: {
      type: Number,
      default: 19,
    },
    dailyLimit: {
      type: Number,
      default: 25,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
export const InstaListModel = mongoose.model("InstaList", InstaListSchema);
