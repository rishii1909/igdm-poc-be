import mongoose, { Schema, Types } from "mongoose";

const InstaFollowUpSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
    },
    profileId: {
      type: Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    messages: [
      {
        type: Types.ObjectId,
        ref: "InstaMessage",
      },
    ],
    status: {
      type: String,
      required: true,
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
export const InstaFollowUpModel = mongoose.model(
  "InstaFollowUp",
  InstaFollowUpSchema
);
