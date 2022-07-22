const router = require("express").Router();
const User = require();

const ReviewModel = require("../models/Review.model");

const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

// CREATE

router.post("/create-review", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;

    const createdReview = await ReviewModel.create({
      ...req.body,
      owner: loggedInUser._id,
    });

    await User.findOneAndUpdate(
      { _id: loggedInUser._id },
      { $push: { review: createdReview._id } }
    );

    return res.status(201).json(createdReview);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});
