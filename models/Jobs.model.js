const { Schema, model, default: mongoose } = require("mongoose");

const JobsSchema = new Schema({
  ownership: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true, maxLength: 32 },
  description: { type: String, required: true, maxLength: 256 },
  amount: { type: Number, required: true },
  currency: {
    type: String,
    enum: ["Dolar"],
    required: true,
  },
  requester: { type: String, required: true },
  game: {
    type: String,
    enum: ["League of Legends", "Counter Strike", "Dota 2", "Tibia"],
    default: "League of Legends",
  },
  publishedDate: { type: Date, default: Date.now() },
  updateDate: { type: Date, default: Date.now() },
  status: {
    type: String,
    enum: ["Launching", "Processing", "Landed"],
    default: "Launching",
  },
});

const JobsModel = model("Jobs", JobsSchema);

module.exports = UserModel;
