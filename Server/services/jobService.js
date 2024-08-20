const jobModel = require("../model/jobModel");

const getJob = async (data) => {
  await jobModel.getJobModel(data)
};

const postJob = async (data) => {
  if (!data) {
    throw new Error("Enter valid data");
  }

  try {
    const result = await jobModel.postJobModel(data);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

const updateJobs = async (data, job_id) => {
  if (!data || !job_id) {
    throw new Error("enter valid data and Id");
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

   const result = await jobModel.updateJobModel(fields, values, job_id);
   return result;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteJobs = async(job_id) =>{
    if(!job_id){
        throw Error("enter valid job ID")
    }
    try{
       const result = await jobModel.deleteJobModel(job_id);
       return result;
    }catch(err){
        throw new Error (err)
    }
    
}

module.exports = {
  getJob,
  postJob,
  updateJobs,
  deleteJobs
};
