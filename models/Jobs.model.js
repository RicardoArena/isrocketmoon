const { Schema, model, default: mongoose, Types } = require("mongoose");

const JobsSchema = new Schema({
  owner: { type: Types.ObjectId, ref: "User" },
  ownerinfo: { type: String },
  pilot: { type: Types.ObjectId, ref: "User" },
  pilotinfo: { type: String },
  title: { type: String, required: true, trim: true, maxLength: 32 },
  description: { type: String, required: true, maxLength: 256 },
  amount: { type: Number, required: true },
  currency: {
    type: String,
    enum: ["Dolar"],
  },

  game: {
    type: String,
    // enum: ["League of Legends", "Counter Strike", "Dota 2", "Tibia"],
  },
  publishedDate: { type: Date, default: Date.now() },
  updateDate: { type: Date, default: Date.now() },
  status: {
    type: String,
    enum: ["Launching", "Processing", "Landed"],
    default: "Launching",
  },
  reviews: [{ type: Types.ObjectId, ref: "Review" }],
});

const JobsModel = model("Jobs", JobsSchema);

module.exports = JobsModel;
