const { Schema, model, default: mongoose, Types } = require("mongoose");

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  nickname: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  description: { type: String },
  // location: {
  //   type: String,
  //   enum: ["North America", "South America", "Europe", "Oceania", "Asia"],
  // },
  passwordHash: { type: String, required: true },
  img: { type: String },
  role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
  isActive: { type: Boolean, default: true },
  disabledOn: { type: Date },
  // typeOfUser: { type: String, enum: ["Pilot", "Owner"], required: true },
  testominals: [{ type: Types.ObjectId, ref: "ReviewPage" }],
  reviews: [{ type: Types.ObjectId, ref: "Review" }],
});

const UserModel = model("User", userSchema);

module.exports = UserModel;
