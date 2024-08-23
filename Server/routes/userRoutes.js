const express = require("express");
const {
  getUserDetails,
  createNewUser,
  updateUserDetails,
  deleteUserDetails,
  loginNewUser,
  getUserDetailsById,
} = require("../controller/userController");

const userRoutes = express.Router();

const { authUser, authRole } = require("../middleware/authmiddleware");

const { verifyOtpDetails } = require("../controller/otpController");

//--------------------- Employee Routes ---------------------------
userRoutes.get("/employee", authUser, authRole("EMPLOYEE"), getUserDetails);
userRoutes.patch(
  "/employee",
  authUser,
  authRole("EMPLOYEE"),
  updateUserDetails
);
userRoutes.patch("/verifyOtp_employee",authUser, authRole("EMPLOYEE"), verifyOtpDetails);

//--------------------- Employer Routes ---------------------------
userRoutes.get("/employer", authUser, authRole("EMPLOYER"), getUserDetails);
userRoutes.patch(
  "/employer",
  authUser,
  authRole("EMPLOYER"),
  updateUserDetails
);
userRoutes.patch("/verifyOtp_employer", authUser, authRole("EMPLOYER"), verifyOtpDetails);

//-------------------- global routes --------------------------
userRoutes.post("/login", loginNewUser);
userRoutes.post("/", createNewUser);
userRoutes.get("/:id", getUserDetailsById);
userRoutes.delete("/:id", deleteUserDetails);


module.exports = userRoutes;
