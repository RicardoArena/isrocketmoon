const { Schema, model, Types } = require("mongoose");

const reviewSchema = new Schema({
  name: { type: Types.ObjectId, ref: "User" },
  nickName: { type: Types.ObjectId, ref: "User" },
  description: { type: String, required: true },

  //   img: { type: Types.ObjectId, ref: "User" },
});

const ReviewPage = model("ReviewPage", reviewSchema);

module.exports = ReviewPage;
