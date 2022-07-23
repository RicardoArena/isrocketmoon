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
    const userReview = await ReviewModel.find();

    return res.status(200).json(userReview);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// READ - DETAILS

router.get("/:idJob", async (req, res) => {
  try {
    const { idJob } = req.params;
    const foundedJob = await JobsModel.findOne({ _id: idJob }).populate(
      "review"
    );

    return res.status(200).json(foundedJob);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// EDIT

router.patch("/edit/:idJob", async (req, res) => {
  try {
    const { idJob } = req.params;

    const body = { ...req.body };

    delete body.date;

    const updatedReview = await ReviewModel.findOneAndUpdate(
      { _id: idJob },
      { ...body },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedReview);
  } catch (err) {
    console.log(err);

    return res.status(500).json(err);
  }
});

// DELETE

router.delete("/delete/:idJob", async (req, res) => {
  try {
    const { idJob } = req.params;
    const deletedReview = await ReviewModel.deleteOne({
      _id: req.params.idJob,
    });

    const jobs = await JobsModel.updateMany(
      { _id: idJob },
      { $pull: { review: createdReview._id } }
    );

    return res.status(200).json(deletedReview);
  } catch (err) {
    console.log(err);

    return res.status(500).json(err);
  }
});

module.exports = router;
