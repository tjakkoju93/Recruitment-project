const pool = require("../connection/db");
const User = require("../model/userModel");

const verifyOtpModel = async (id, otp) => {
  const user = await User.checkExistId(id);
  if (!user) {
    throw Error({ message: "User not found" });
  }
  if (otp != user.otp) {
    throw Error({ message: "Invalid otp , please re-enter the valid otp" });
  }
  try {
    const query = "update Employee_Employers set isVerified = ? , otp = ?";
    const [result] = await pool.query(query, [1, null]);
    console.log(result);
    return result;
  } catch (err) {
    throw Error({ message: err });
  }
};

const sendOtpModel = async (otp, id) => {
  const user = await User.checkExistId(id);
  if (!user) {
    throw Error({ message: "User not found" });
  }
  try {
    const query = "update Employee_Employers set otp = ? where id = ?";
    const [result] = await pool.query(query, [otp, id]);
    console.log(result)
    return result
  } catch (err) {
    throw Error({ message: err });
  }

  user.otp = otp;
  user.save();
};

module.exports = { verifyOtpModel, sendOtpModel };
