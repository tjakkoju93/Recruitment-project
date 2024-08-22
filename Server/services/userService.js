const User = require("../model/userModel");
const getToken = require("../utils/genToken");

const { otpModule } = require("../services/otpService");

const getUser = async (email) => {
  try {
    if (!email) {
      throw error({ message: "Auth token required" });
    }
    const data = await User.checkExistEmail(email);
    return data;
  } catch (err) {
    throw new Error({ message: err });
  }
};

const getUserId = async (id) => {
  try {
    if (!id) {
      throw error({ message: "Enter valid Id" });
    }
    const data = await User.checkExistId(id);
    return data;
  } catch (err) {
    throw new Error({ message: err });
  }
};

const createUser = async (data) => {
  if (!data) {
    console.log("Please enter all the mandatory fields");
  }
  try {
    const user = await User.userCreateModel(data);
    if (!user) {
      throw new Error("user creation is not successful");
    }
    const otpGeneration = await otpModule(user);
    console.log(otpGeneration);
    const token = await getToken(user.email, user.user_role);
    if (!token) {
      throw new Error("Token generation failed");
    }
    return token;
  } catch (err) {
    res.status(400).send({ message: err });
  }
};

const updateUser = async (data, email) => {
  if (!data || !email) {
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
  values.push(email);
  const user = await User.updateUserModel(fields, values, email);
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
    await User.deleteUserModel(id);
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
    const user = await User.loginUserModel(email, password);
    const token = await getToken(user.id, user.user_role);
    if (!token) {
      throw new Error("Token generation failed");
    }
    return token;
  } catch {
    res.status(400).send({ message: err });
  }
};

module.exports = {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getUserId,
};
