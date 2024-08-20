const {
  userModel,
  userCreateModel,
  updateUserModel,
  deleteUserModel,
  loginUserModel,
} = require("../model/userModel");
const getToken = require("../utils/genToken");

const getUser = async (req, res) => {
  try {
    const data = await userModel();
    return data;
  } catch (err) {
    res.status(400).send({ message: err });
  }
};

const createUser = async (data) => {
  if (!data) {
    console.log("Please enter all the mandatory fields");
  }
  try {
    const id = await userCreateModel(data);
    if (!id) {
      throw new Error("user creation is not successful");
    }
    const token = await getToken(id);
    if (!token) {
      throw new Error("Token generation failed");
    }
    return token;
  } catch (err) {
    res.status(400).send({ message: err });
  }
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
  try {
    await deleteUserModel(id);
    return true;
  } catch (err) {
    res.status(400).send({ message: err });
  }
};

const loginUser = async (data) => {
  const { email, password } = data;
  if (!data) {
    throw new Error("Enter valid user details");
  }
  try {
    const user = await loginUserModel( email, password );
    const token = await getToken(user.email);
    if (!token) {
      throw new Error("Token generation failed");
    }
    return token;
  } catch {
    res.status(400).send({ message: err });
  }
};

module.exports = { getUser, createUser, updateUser, deleteUser, loginUser };
