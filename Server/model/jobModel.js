const pool = require("../connection/db");

const getJobDetailsId = async (job_id) => {
  const query = "select * from job_details where job_id = ?";
  const [result] = await pool.query(query, job_id);
  return result;
};

const getAllJobs = async () => {
  const query = "select * from job_details";
  const [result] = await pool.query(query);
  return result;
};

const getEmployerJobs = async (employerID) => {
  const query = "select * from job_details where employerID = ?";
  const [result] = await pool.query(query, employerID);
  return result;
};
const getEmployeeJobs = async (employeeID) => {
  const query = "select * from job_details where employeeID = ?";
  const [result] = await pool.query(query, employeeID);
  return result;
};

const getJobModel = async (job_id) => {
  try {
    if (user_role == "EMPLOYEE") {
      const result = await getEmployeeJobs(employeeID);
    } else if (user_role == "EMPLOYER") {
      const result = await getEmployerJobs(employerID);
    }
  } catch (err) {
    throw new Error(err);
  }
};

const postJobModel = async (data) => {
  console.log(data);
  const {
    jobcompanyName,
    jobRole,
    jobTechnologies,
    jobExperienceRequired,
    jobLocation,
    jobGraduate,
    language,
    jobNoticePeriod,
  } = data;
  try {
    const query = ` INSERT INTO job_details (
    jobcompanyName,
    jobRole,
    jobTechnologies,
    jobExperienceRequired,
    jobLocation,
    jobGraduate,
    language,
    jobNoticePeriod
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const result = await pool.query(query, [
      jobcompanyName,
      jobRole,
      jobTechnologies,
      jobExperienceRequired,
      jobLocation,
      jobGraduate,
      language,
      jobNoticePeriod,
    ]);
    return getAllJobs();
  } catch (error) {
    throw error;
  }
};

const updateJobModel = async (fields, values, job_id) => {
  try {
    const query = `UPDATE job_details SET
    ${fields.join(", ")} WHERE job_id = ?`;

    const returnValue = await pool.query(query, values);
    if (returnValue[0].affectedRows >= 1) {
      const result = await getJobDetailsId(job_id);
      return result;
    }
  } catch (err) {
    throw new Error(err);
  }
};

const deleteJobModel = async (job_id) => {
  const exists = await getJobDetailsId(job_id);
  if (!exists) {
    throw Error("Jobs not found");
  }
  try {
    const query = "delete from job_details where job_id = ?";
    const result = await pool.query(query, job_id);
    if (result[0].affectedRows >= 1) {
      return "job deleted successfully";
    }
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  postJobModel,
  updateJobModel,
  deleteJobModel,
  getJobModel
};
