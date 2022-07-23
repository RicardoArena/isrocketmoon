const router = require("express").Router();
const User = require("../models/User.model");

const ReviewModel = require("../models/ReviewPage.model");

const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

// CREATE

router.post(
  "/create-review-page",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const loggedInUser = req.currentUser;

      //   const { idUser } = req.params;
      const createdReview = await ReviewModel.create({
        ...req.body,
        owner: req.currentUser._id,
        owner: loggedInUser._id,
      });

      await User.findOneAndUpdate(
        { _id: loggedInUser._id },
        { $push: { reviewpage: createdReview._id } }
      );

      return res.status(201).json(createdReview);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);

// READ ALL

router.get("/my-review-page", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;

    const userReview = await ReviewModel.find(
      { owner: loggedInUser._id },
      { reviews: 0 }
    );

    return res.status(200).json(userReview);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

module.exports = router;
