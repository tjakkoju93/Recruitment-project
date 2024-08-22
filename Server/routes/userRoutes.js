const express = require("express");
const {
  getUserDetails,
  createNewUser,
  updateUserDetails,
  deleteUserDetails,
  loginNewUser,
  getUserDetailsById
} = require("../controller/userController");

const userRoutes = express.Router();

const { authUser, authRole } = require("../middleware/authmiddleware");


//--------------------- Employee Routes ---------------------------
userRoutes.get("/employee", authUser, authRole("EMPLOYEE"), getUserDetails);
userRoutes.patch("/employee", authUser,authRole("EMPLOYEE"), updateUserDetails);

//--------------------- Employer Routes ---------------------------
userRoutes.get("/employer", authUser,authRole("EMPLOYER"), getUserDetails);
userRoutes.patch("/employer",authUser, authRole("EMPLOYER"), updateUserDetails);

//-------------------- global routes --------------------------
userRoutes.post("/login", loginNewUser);
userRoutes.post("/", createNewUser);
userRoutes.get("/:id", getUserDetailsById);
userRoutes.delete("/:id", deleteUserDetails);

module.exports = userRoutes;
