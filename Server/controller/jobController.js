const jobService = require("../services/jobService");

const getJobDetails = async (req, res) => {
  const { id, user_role } = req.user;

  try {
    const result = await jobService.getJob(id, user_role);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

const postJobDetails = async (req, res) => {
  const data = req.body;
  const { id, user_role } = req.user;
  try {
    const jobDetails = await jobService.postJob(data, id);
    return res.status(201).json(jobDetails);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const updateJobDetails = async (req, res) => {
  const data = req.body;
  const { job_id } = req.params;
  const { id, user_role } = req.user;
  try {
    if (user_role == "EMPLOYEE") {
      res.status(400).json({message : "User doesnt have access to update job"})
    }

    if (user_role == "EMPLOYER") {
      const result = await jobService.updateJobs(data, job_id, id);
      return res.status(200).json(result);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const deleteJobDetails = async (req, res) => {
  const { job_id } = req.params;

  try {
    const result = await jobService.deleteJobs(job_id);
    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ mesasge: err });
  }
};

const applyJobsEmployee = async (req, res) => {
  const { job_id } = req.params;
  const { id, user_role } = req.user;

  try {
    const result = await jobService.applyJobs(id, job_id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const jobsAppliedDetails = async (req, res) => {
  const { id, user_role } = req.user;
  try {
    const result = await jobService.jobsApplied(id,user_role);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports = {
  getJobDetails,
  postJobDetails,
  updateJobDetails,
  deleteJobDetails,
  applyJobsEmployee,
  jobsAppliedDetails,
};
