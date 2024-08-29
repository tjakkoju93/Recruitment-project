const User = require("../services/userService");

const getUserDetails = async (req, res) => {
  const { email, user_role ,_id} = req.user;
  console.log(email,role,_id)
  try {
    if (email) {
      const response = await User.getUser(email);
      res.status(200).send(response);
    }
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

const getUserDetailsById = async (req, res) => {
  const {id} = req.params;

  try {
    const response = await User.getUserId(id);
    res.status(200).send(response[0]);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const createNewUser = async (req, res) => {
  try {
    const data = req.body;
    const token = await User.createUser(data);
    if (!token) {
      res.status(400).json({ message: "User creation failed" });
    }
    res.status(201).json(token);
  } catch (err) {
    res.status(400).json(err);
  }
};

const updateUserDetails = async (req, res) => {
  const data = req.body;
  const {email,user_role} = req.user;
  try {
    const user = await User.updateUser(data,email);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

const deleteUserDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.deleteUser(id);
    if (user) {
      res.status(200).json({ message: "User deleted successfully" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

const loginNewUser = async (req, res) => {
  const data = req.body;
  try {
    const token = await User.loginUser(data);
    res.status(200).json(token);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = {
  getUserDetails,
  createNewUser,
  updateUserDetails,
  deleteUserDetails,
  loginNewUser,
  getUserDetailsById
};
