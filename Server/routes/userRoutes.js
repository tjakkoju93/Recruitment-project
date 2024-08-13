const express = require("express");
const {
  getUserDetails,
  createNewUser,
  updateUserDetails,
  deleteUserDetails
} = require("../controller/userController");

const userRoutes = express.Router();

userRoutes.post("/", createNewUser);
userRoutes.get("/", getUserDetails);
userRoutes.patch("/:id",updateUserDetails)
userRoutes.delete("/:id",deleteUserDetails)

module.exports = userRoutes;
