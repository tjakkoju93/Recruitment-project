const jobService = require("../services/jobService");

const getJobDetails = async (req, res) => {
  try {
    
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

const postJobDetails = async (req, res) => {
  const data = req.body;

  try {
    const jobDetails = await jobService.postJob(data);
    return res.status(201).json(jobDetails);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const updateJobDetails = async (req, res) => {
  const data = req.body;
  const { job_id } = req.params;
  try {
    const result = await jobService.updateJobs(data, job_id);
    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const deleteJobDetails = async (req, res) => {
  const { job_id } = req.params;

  try {
    const result = await jobService.deleteJobs(job_id);
    return res.status(200).json({message : result})
  } catch (err) {
    res.status(500).json({ mesasge: err });
  }
};

module.exports = {
  getJobDetails,
  postJobDetails,
  updateJobDetails,
  deleteJobDetails,
};
