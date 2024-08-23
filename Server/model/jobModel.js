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

const getAppliedJobs = async (user_role, id) => {
  try {
    if (user_role == "EMPLOYEE") {
      const query = ` select jd.*,em.employeeID,em.appliedStatus from job_details jd 
      join employee_mapping em on jd.job_id = em.job_id 
      where em.employeeID = ? and appliedStatus = "APPLIED" `;
      const [result] = await pool.query(query, id);
      return result;
    }
    if (user_role == "EMPLOYER") {
      const query = `select jd.*,em.appliedStatus,em.employeeID from job_details jd 
      join employee_mapping em on jd.job_id = em.job_id
      where  em.appliedStatus = "APPLIED" and jd.employerID = ? `;
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
  const [exists] = await User.checkExistId(id);
  const [jobs] = await getJobDetailsId(job_id);

  if (!exists || !jobs) {
    throw new error({ message: Error });
  } else if (exists.id != jobs.employerID) {
    return Error({ message: "User doesnt have access to update the job" });
  }
  try {
    const query = `UPDATE job_details SET
    ${fields.join(", ")} WHERE job_id = ? and employerID = ?`;

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

const employeeJobs = async (job_id, employeeID) => {
  const query =
    "select * from employee_mapping where job_id = ? and employeeID =?";
  const [result] = await pool.query(query, [job_id, employeeID]);
  return result;
};

const applyJobModel = async (id, job_id) => {
  try {
    const [job] = await getJobDetailsId(job_id);
    const [user] = await User.checkExistId(id);

    if (!job || !user) {
      throw new Error("Invalid job ID or user ID");
    }

    const employeeJobsApplied = await employeeJobs(job_id, id);
    if (employeeJobsApplied.length > 0) {
      throw new Error("User has already applied for this job");
    }

    if (user.user_role !== "EMPLOYEE") {
      throw new Error("Only employees can apply for jobs");
    }

    const query =
      "INSERT INTO employee_mapping (job_id, employeeID, appliedStatus) VALUES (?, ?, ?)";
    const [result] = await pool.query(query, [job_id, user.id, "APPLIED"]);
    const response = await getAppliedJobs(user.user_role, id);

    if (result.affectedRows >= 1) {
      return response;
    } else {
      throw new Error("Failed to apply for the job");
    }
  } catch (err) {
    throw new Error(
      err.message || "An error occurred while applying for the job"
    );
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
  employeeJobs,
};
