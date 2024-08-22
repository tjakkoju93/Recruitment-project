const jobModel = require("../model/jobModel");

const getJob = async (id, user_role) => {
  if (!id || !user_role) {
    throw error({ mesage: error });
  }
  try {
    if (user_role == "EMPLOYEE") {
      const result = await jobModel.getAllJobs();
      return result;
    } else if (user_role == "EMPLOYER") {
      const result = await jobModel.getEmployerJobModel(id);
      return result;
    }
  } catch (err) {
    throw error({ message: err });
  }
};

const postJob = async (data, id) => {
  if (!data || !id) {
    throw new Error("Enter valid data or authorization required");
  }

  try {
    const result = await jobModel.postJobModel(data, id);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

const updateJobs = async (data, job_id, id) => {
  if (!data || !job_id || !id) {
    throw new Error("enter valid data or Id");
  }
  try {
    const fields = [];
    const values = [];
    for (const key in data) {
      if (
        data.hasOwnProperty(key) &&
        data[key] !== undefined &&
        data[key] !== null
      ) {
        const columnName = key;
        fields.push(`${columnName} = ?`);
        values.push(data[key]);
      }
    }
    const updatedAt = new Date();
    fields.push("updatedAt = ?");
    values.push(updatedAt);
    if (fields.length === 0) {
      throw new Error("No fields to update.");
    }

    values.push(job_id);
    values.push(id);
    const result = await jobModel.updateJobModel(fields, values, job_id, id);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteJobs = async (job_id) => {
  if (!job_id) {
    throw Error("enter valid job ID");
  }
  try {
    const result = await jobModel.deleteJobModel(job_id);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

const applyJobs = async (id, job_id) => {
  if (!id || !job_id) {
    throw Error({ message: "Enter valid job id" });
  }
  try {
    const result = await jobModel.applyJobModel(id,job_id);
    return result
  } catch (err) {
    throw Error({ message: error });
  }
};

const jobsApplied = async (id,user_role) =>{
  if (!id || !user_role) {
    throw Error({ message: "Enter valid job id" });
  }
  try {
    const result = await jobModel.getAppliedJobs(user_role,id);
    return result
  } catch (err) {
    throw Error({ message: error });
  }
}

module.exports = {
  getJob,
  postJob,
  updateJobs,
  deleteJobs,
  applyJobs,
  jobsApplied,
};
