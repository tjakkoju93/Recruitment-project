const {
  userModel,
  userCreateModel,
  updateUserModel,
  deleteUserModel
} = require("../model/userModel");

const getUser = async (req, res) => {
  const data = await userModel();
  return data;
};

const createUser = async (data) => {
  if (!data) {
    console.log("Please enter all the mandatory fields");
  }
  const createdAt = new Date();
  const updatedAt = new Date();
  const user = await userCreateModel(data, createdAt, updatedAt);
  if (!user) {
    throw new Error("user creation is not successful");
  }
  return user;
};

const updateUser = async (data, id) => {
  if (!data || !id) {
    throw new Error("Provide valid data and id");
  }
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

  values.push(id);

  const user = await updateUserModel(fields, values, id);
  if (!user) {
    throw new Error("Update unsuccessful");
  }
  return user;
};

const deleteUser = async (id) => {
  if (!id) {
    throw new Error("Enter valid user id");
  }
  await deleteUserModel(id);
};

module.exports = { getUser, createUser, updateUser, deleteUser };
