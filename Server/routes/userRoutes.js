const express = require("express");
const {
  getUserDetails,
  createNewUser,
  updateUserDetails,
  deleteUserDetails,
  loginNewUser
} = require("../controller/userController");

const userRoutes = express.Router();

// const authUser = require("../middleware/authmiddleware");

userRoutes.post("/login",loginNewUser)
userRoutes.post("/", createNewUser);
userRoutes.get("/", getUserDetails);
userRoutes.patch("/:id",updateUserDetails)
userRoutes.delete("/:id",deleteUserDetails)

module.exports = userRoutes;
