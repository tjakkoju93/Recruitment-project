const nodemailer = require("nodemailer");
require("dotenv").config();
const { verifyOtpModel, sendOtpModel } = require("../model/otpModel");

const getOTP = async () => {
  return Math.floor(Math.random() * (999999 - 100000)) + 100000;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = (otp, email) => {
  if (!otp || !email) {
    throw Error({ message: "enter valid otp and email" });
  }
  try {
    transporter.sendMail(
      {
        from: '"Tejaswini Jakkoju" <jakkoju1993@gmail.com>',
        to: email,
        subject: "OTP verification mail",
        html: `Your verification code ${otp}`,
      },
      (err, val) => {
        if (err) {
          return res.status(400).json({ message: err });
        } else {
          return res.status(400).json({ message: val.response });
        }
      }
    );
  } catch (err) {
    throw Error({ message: err });
  }
};

const otpModule = (user) => {
  const otp = genOTP();
  if (!otp || !user.email || !user.id) {
    throw Error({ message: "enter valid otp and email" });
  }
  try {
    sendEmail(otp, user.email);
    const result = sendOtpModel(otp, user.id);
    if (!result) {
      throw error({ message: "OTP not verified" });
    }
    const token = generateToken(user._id, user.user_role);
    return token;
  } catch (err) {
    throw Error({ message: err });
  }
};

const verifyOtp = async (id, otp) => {
  if (!id || !otp) {
    throw Error({ message: "User is not authorised or OTP is required" });
  }
  try {
    const result = await verifyOtpModel(id, otp);
  } catch (err) {
    throw Error({ message: err });
  }
};

module.exports = { getOTP, transporter, sendEmail, otpModule, verifyOtp };
