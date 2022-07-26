const router = require("express").Router();
const UserModel = require("../models/User.model");

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

      await UserModel.findOneAndUpdate(
        { _id: loggedInUser._id },
        { $push: { testimonials: createdReview._id } }
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

// READ DETAIL
router.get("/:reviewId", isAuth, attachCurrentUser, async (req, res) => {
  try {
    // const loggedInUser = req.currentUser;

    const { reviewId } = req.params;

    const foundReview = await ReviewModel.findOne({ _id: reviewId });

    return res.status(200).json(foundReview);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// EDIT REVIEW PAGE
router.patch("/edit/:reviewId", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;

    const { reviewId } = req.params;

    const body = { ...req.body };

    // const jobs = await JobsModel.findOne({ _id: jobsId });

    // if (jobs.owner !== loggedInUser._id) {
    //   return res
    //     .status(401)
    //     .json({ message: "Você não pode alterar esse job!" });
    // }

    const updateReviewPage = await ReviewModel.findOneAndUpdate(
      { _id: reviewId },
      { ...body },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updateReviewPage);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// DELETE REVIEW PAGE

router.delete(
  "/delete/:reviewId",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { reviewId } = req.params;
      const loggedInUser = req.currentUser;

      // const reviewPage = await ReviewModel.findOne({ _id: reviewId });

      // if (job.owner !== loggedInUser._id) {
      //   return res
      //     .status(401)
      //     .json({ message: "Você não pode deletar esse album." });
      // }

      await UserModel.findOneAndUpdate(
        { _id: loggedInUser._id },
        { $pull: { testimonials: reviewId } },
        { runValidators: true, new: true }
      );

      const deletedReviewPage = await ReviewModel.deleteOne({
        _id: reviewId,
      });

      return res.status(200).json(deletedReviewPage);
    } catch (err) {
      console.log(err);

      return res.status(500).json(err);
    }
  }
);

module.exports = router;
