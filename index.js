require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/db.config")();

const app = express();
app.use(express.json());
// const whiteList = [process.env.REACT_APP_URL, process.env.AWS_APP_URL];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whiteList.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

// app.use(cors(corsOptions));
app.use(cors());

const uploadImgRouter = require("./routes/uploadimg.routes");
app.use("/", uploadImgRouter);

const userRouter = require("./routes/user.routes");
app.use("/user", userRouter);

const jobsRouter = require("./routes/jobs.routes");
app.use("/jobs", jobsRouter);

const reviewRouter = require("./routes/review.routes");
app.use("/review", reviewRouter);

const reviewPageRouter = require("./routes/reviewpage.routes");
app.use("/review-page", reviewPageRouter);

app.listen(Number(process.env.PORT), () => {
  console.log("Server up at port: ", process.env.PORT);
});
