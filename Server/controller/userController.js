const {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
} = require("../services/userService");

const getUserDetails = async (req, res) => {
  try {
    const response = await getUser();
    res.status(200).send(response[0]);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

const createNewUser = async (req, res) => {
  try {
    const data = req.body;
    const token = await createUser(data);
    if(!token){
      res.status(400).json({message:"User creation failed"})
    }
    res.status(201).json(token);
  } catch (err) {
    res.status(400).json(err);
  }
};

const updateUserDetails = async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  try {
    const user = await updateUser(data, id);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

const deleteUserDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await deleteUser(id);
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
    const result = await loginUser(data);
    console.log(result);
    res.status(200).json(result)
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
};
