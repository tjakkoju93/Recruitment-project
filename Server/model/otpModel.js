const pool = require("../connection/db");
const User = require("../model/userModel");

const verifyOtpModel = async (id, otp) => {
  const [user] = await User.checkExistId(id);
  if (!user) {
    throw Error({ message: "User not found" });
  }
  if (otp != user.OTP) {
    throw Error({ message: "Invalid otp , please re-enter the valid otp" });
  }
  try {
    const query =
      "update Employee_Employers set isVerified = ? , otp = ? where id = ?";
    const [result] = await pool.query(query, [1, null, id]);
    if (result.affectedRows < 1) {
      throw error({ message: "OTP verification failed" });
    }
    return "OTP verified";
  } catch (err) {
    throw Error({ message: err });
  }
};

const sendOtpModel = async (otp, id) => {
  const exists = await User.checkExistId(id);
  if (!exists) {
    throw Error({ message: "User not found" });
  }
  try {
    const query = "update Employee_Employers set otp = ? where id = ?";
    const [result] = await pool.query(query, [otp, id]);
    if (result.affectedRows < 1) {
      throw Error({ message: "OTP not registered in data base" });
    }
    const [user] = await User.checkExistId(id);
    return user;
  } catch (err) {
    throw Error({ message: err });
  }
};

module.exports = { verifyOtpModel, sendOtpModel };
