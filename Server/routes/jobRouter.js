const express = require("express");
const jobRouter = express.Router();
const {
  getJobDetails,
  postJobDetails,
  updateJobDetails,
  deleteJobDetails,
  applyJobsEmployee,
  jobsAppliedDetails
} = require("../controller/jobController");

const { authUser, authRole } = require("../middleware/authmiddleware");

//--------------------- Employee Routes ---------------------------
jobRouter.get("/employee", authUser, authRole("EMPLOYEE"), getJobDetails);
jobRouter.patch("/applyjob_employee/:job_id",authUser,authRole("EMPLOYEE"),applyJobsEmployee);
jobRouter.get("/applied_employee",authUser,authRole("EMPLOYEE"),jobsAppliedDetails);

//--------------------- Employer Routes ---------------------------
jobRouter.get("/employer", authUser, authRole("EMPLOYER"), getJobDetails);
jobRouter.post("/", authUser, authRole("EMPLOYER"), postJobDetails);
jobRouter.patch("/:job_id", authUser, authRole("EMPLOYER"), updateJobDetails);
jobRouter.get("/applied_employer",authUser,authRole("EMPLOYER"),jobsAppliedDetails);

//--------------------- admin Routes ---------------------------
jobRouter.delete("/:job_id", deleteJobDetails);

module.exports = jobRouter;
