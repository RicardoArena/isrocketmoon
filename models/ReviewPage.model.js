const { Schema, model, Types } = require("mongoose");

const reviewSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  rate: { type: String, required: true },
  date: { type: Date, default: Date.now() },

  name: [{ type: Types.ObjectId, ref: "User" }],
});

const ReviewPage = model("ReviewPage", reviewSchema);

module.exports = ReviewPage;
