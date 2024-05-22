import mongoose, { Schema, Types } from "mongoose";

const InstaListSequenceSchema = new Schema(
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
    templates: [
      {
        type: [Types.ObjectId],
        ref: "InstaTemplate",
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
export const InstaListSequenceModel = mongoose.model(
  "InstaListSequence",
  InstaListSequenceSchema
);
