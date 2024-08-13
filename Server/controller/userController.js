const { getUser, createUser, updateUser, deleteUser } = require("../services/userService");

const getUserDetails = async (req, res) => {
  const response = await getUser();
  res.status(200).send(response[0]);
};

const createNewUser = async (req, res) => {
  const data = req.body;
  const user = await createUser(data);
  if (!user) {
    res.status(400).json({ message: "User creation is unsuccessful" });
  }
  res.status(201).json(user);
};

const updateUserDetails = async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  const user = await updateUser(data, id);
  res.status(200).json(user);
};

const deleteUserDetails= async(req,res) =>{
  const {id} = req.params;
  const user = await deleteUser (id);

}

module.exports = { getUserDetails, createNewUser, updateUserDetails, deleteUserDetails };
