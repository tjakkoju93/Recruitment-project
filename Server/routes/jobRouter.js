const express = require("express");
const jobRouter = express.Router();
const {
  getJobDetails,
  postJobDetails,
  updateJobDetails,
  deleteJobDetails
} = require("../controller/jobController");

jobRouter.get("/", getJobDetails);
jobRouter.post("/", postJobDetails);
jobRouter.patch("/:job_id", updateJobDetails);
jobRouter.delete("/:job_id", deleteJobDetails);

module.exports = jobRouter;
