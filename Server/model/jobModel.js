const pool = require("../connection/db");
const User = require("../model/userModel");

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
// const getEmployeeJobs = async (employeeID) => {
//   const query = "select * from job_details where employeeID = ?";
//   const [result] = await pool.query(query, employeeID);
//   return result;
// };

const getAppliedJobs = async (user_role, id) => {
  try {
    if (user_role == "EMPLOYEE") {
      const query = `select * from job_details where employeeID = ? and jobStatus = "APPLIED" `;
      const [result] = await pool.query(query, id);
      return result;
    }
    if (user_role == "EMPLOYER") {
      const query = `select * from job_details where employerID = ? and jobStatus = "APPLIED" `;
      const [result] = await pool.query(query, id);
      return result;
    }
  } catch (err) {
    throw error({ message: err });
  }
};

// const getJobModel = async (job_id) => {
//   try {
//     if (user_role == "EMPLOYEE") {
//       const result = await getEmployeeJobs(employeeID);
//     } else
//      if (user_role == "EMPLOYER") {
//       const result = await getEmployerJobs(employerID);
//     }
//   } catch (err) {
//     throw new Error(err);
//   }
// };

const getEmployerJobModel = async (id) => {
  try {
    const user = await User.checkExistEmail(id);
    if (!user) {
      throw error({ message: error });
    }
    const result = await getEmployerJobs(id);
    console.log(result);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

const postJobModel = async (data, id) => {
  const exists = await User.checkExistId(id);
  if (!exists) {
    throw error({ message: Error });
  }
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
    jobNoticePeriod,
    employerID
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await pool.query(query, [
      jobcompanyName,
      jobRole,
      jobTechnologies,
      jobExperienceRequired,
      jobLocation,
      jobGraduate,
      language,
      jobNoticePeriod,
      id,
    ]);
    return getEmployerJobs(id);
  } catch (error) {
    throw error;
  }
};

const updateJobModel = async (fields, values, job_id, id) => {
  const exists = await User.checkExistId(id);
  console.log(exists);
  if (!exists) {
    throw error({ message: Error });
  }
  try {
    const query = `UPDATE job_details SET
    ${fields.join(", ")} WHERE job_id = ? and employerID = ?`;
    console.log(values);

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

const applyJobModel = async (id, job_id) => {
  const [job] = await getJobDetailsId(job_id);
  const [user] = await User.checkExistId(id);
  if (!job || !user) {
    throw Error({ message: "Enter valid job id or user" });
  }
  if (job.jobStatus == "Applied" && job.employeeID == id) {
    throw error({ messgae: "User already applied for job" });
  }
  try {
    if (user.user_role == "EMPLOYEE") {
      const query =
        "update job_details set jobStatus = ? , employeeID = ? where job_id = ?";
      const [result] = await pool.query(query, ["APPLIED", id, job_id]);
      if (result.affectedRows >= 1) {
        return getAppliedJobs(user.user_role, id);
      }
    }
  } catch (err) {
    throw error({ message: err });
  }
};

module.exports = {
  postJobModel,
  updateJobModel,
  deleteJobModel,
  // getJobModel,
  getEmployerJobModel,
  applyJobModel,
  getAppliedJobs,
  getAllJobs,
};
