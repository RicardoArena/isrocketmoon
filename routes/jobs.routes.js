const router = require("express").Router();
const bcrypt = require("bcrypt");
const JobsModel = require("../models/Jobs.model");
const UserModel = require("../models/User.model");
const ReviewModel = require("../models/Review.model");

const generateToken = require("../config/jwt.config");
const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

const saltRounds = 10;

router.post("/createjob", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;
    if (loggedInUser.typeOfUser === "Pilot") {
      return res.status(409).json("Ação Indisponível para o Perfil.");
    }
    const createdJob = await JobsModel.create({
      ...req.body,
      pilot: null,
      owner: loggedInUser._id,
    });
    await UserModel.findOneAndUpdate(
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
    ).populate("pilot");

    return res.status(200).json(userJobs);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.get("/alljobs", async (req, res) => {
  try {
    const allJobs = await JobsModel.find().populate("pilot");

    return res.status(200).json(allJobs);
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
    // .populate("owner")
    // .populate("pilot");
    const ownerinfo = await UserModel.find({ _id: foundJobs.owner });
    foundJobs.ownerinfo = ownerinfo.name;

    return res.status(200).json(foundJobs);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.get("/pilot/:jobsId", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;
    if (loggedInUser.typeOfUser === "Owner") {
      return res.status(409).json("Ação Indisponível para o Perfil.");
    }

    const { jobsId } = req.params;

    // Verificar se o Job do identificador X, possui um Pilot.
    // Caso o Job tenha Pilot, é necessário exibir uma mensagem de erro.
    // Caso não tenha Pilot, iremos designar o Pilot que fez a requisição para este job.
    const foundJobs = await JobsModel.findOne({ _id: jobsId });
    if (foundJobs.pilot === null || foundJobs.pilot === "") {
      await JobsModel.findOneAndUpdate(
        { _id: jobsId },
        { pilot: loggedInUser._id }
      );
      const updatedJob = await JobsModel.findOne({ _id: jobsId });
      return res.status(200).json(updatedJob);
    } else {
      return res.status(409).json("Este Job já tem um Pilot.");
    }
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
      { ...req.body },
      { new: true, runValidators: true }
    );

    delete updateJob._doc.passwordHash;

    return res.status(200).json(updateJob);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

//SOFT DELETE

router.delete(
  "/delete/:jobsId",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { jobsId } = req.params;
      const loggedInUser = req.currentUser;

      // const job = await JobsModel.findOne({ _id: jobsId });

      // if (job.owner !== loggedInUser._id) {
      //   return res
      //     .status(401)
      //     .json({ message: "Você não pode deletar esse album." });
      // }
      await UserModel.findOneAndUpdate(
        { _id: loggedInUser._id },
        { $pull: { jobs: jobsId } },
        { runValidators: true, new: true }
      );

      const deletedJob = await JobsModel.deleteOne({
        _id: jobsId,
      });

      // await ReviewModel.updateMany(
      //   { jobs: jobsId },
      //   { $pull: { jobs: jobsId } }
      // );

      return res.status(200).json(deletedJob);
    } catch (err) {
      console.log(err);

      return res.status(500).json(err);
    }
  }
);

module.exports = router;
