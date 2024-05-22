import mongoose, { Schema, Types } from "mongoose";

const InstaMessageSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
    },
    instaListId: {
      type: Types.ObjectId,
      ref: "InstaList",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    isSeen: Boolean,
    thread_id: String,
    item_id: String,
    item_type: String,
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
export const InstaMessageModel = mongoose.model(
  "InstaListSequence",
  InstaMessageSchema
);
