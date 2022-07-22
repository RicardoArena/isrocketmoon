const router = require("express").Router();
const ReviewModel = require("../models/Review.model");

const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");
const JobsModel = require("../models/Jobs.model");

// CREATE

router.post(
  "/create-review/:idJob",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const loggedInUser = req.currentUser;

      const { idJob } = req.params;

      const createdReview = await ReviewModel.create({
        ...req.body,
        owner: loggedInUser._id,
      });

      await JobsModel.findOneAndUpdate(
        { _id: idJob },
        { $push: { review: createdReview._id } }
      );

      return res.status(201).json(createdReview);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

// READ ALL

router.get("/my-review", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const myReview = await MemoryModel.find();

    return res.status(200).json(myReview);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// READ - DETAILS

module.exports = router;
