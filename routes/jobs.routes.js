const router = require("express").Router();
const bcrypt = require("bcrypt");
const JobsModel = require("../models/Jobs.model");
const UserModel = require("../models/User.model");

const generateToken = require("../config/jwt.config");
const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

const saltRounds = 10;

router.post("/createjob", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;

    const createdJob = await JobsModel.create({
      ...req.body,
      owner: req.currentUser._id,
      owner: loggedInUser._id,
    });
    await JobsModel.findOneAndUpdate(
      { _id: loggedInUser._id },
      { $push: { jobs: createdJob._id } }
    );

    return res.status(201).json(createdJob);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.get("/myjobs", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;

    const userJobs = await JobsModel.find(
      { owner: loggedInUser._id },
      { reviews: 0 }
    );

    return res.status(200).json(userJobs);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.get("/:jobsId", isAuth, attachCurrentUser, async (req, res) => {
  try {
    // const loggedInUser = req.currentUser;

    const { jobsId } = req.params;

    const foundJobs = await JobsModel.findOne({ _id: jobsId });

    return res.status(200).json(foundJobs);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.patch("/edit/:jobsId", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;

    const { jobsId } = req.params;

    const body = { ...req.body };

    // const jobs = await JobsModel.findOne({ _id: jobsId });

    // if (jobs.owner !== loggedInUser._id) {
    //   return res
    //     .status(401)
    //     .json({ message: "Você não pode alterar esse job!" });
    // }

    const updateJob = await JobsModel.findOneAndUpdate(
      { _id: jobsId },
      { ...body },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updateJob);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

//SOFT DELETE

router.delete(
  "/disable-profile",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const disabledJob = await JobsModel.findOneAndUpdate(
        { _id: req.currentUser._id },
        { isActive: false, disabledOn: Date.now() },
        { runValidators: true, new: true }
      );

      delete disabledJob._doc.passwordHash;

      return res.status(200).json(disabledJob);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);

module.exports = router;
