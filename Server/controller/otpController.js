const { verifyOtp } = require("../services/otpService");

const verifyOtpDetails = async (req, res) => {
  const { otp } = req.body;
  const { id, user_role } = req.user;
  try {
    const result = await verifyOtp(id, otp);
    return res.status(200).json({ message: "Email verification successful" });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports = { verifyOtpDetails };
