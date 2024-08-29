const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../model/userModel");

const authUser = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ Error: "Authorization token required" });
  }
  const token = await authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ Error: "Bearer token is invalid" });
  }
  try {
    const { id, user_role } = await jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    const [user] = await User.checkExistId(id);

    if (!user) {
      return res.status(401).json({ error: "User not found or role mismatch" });
    }
    req.user = user;
    console.log(req.user)

    next();
  } catch (err) {
    return res.status(401).json({ Error: err.message });
  }
};

const authRole = (expectedRole) => {
  return (req, res, next) => {
    const user_role = req.user.user_role;
    if (expectedRole && user_role !== expectedRole) {
      return res
        .status(403)
        .json({ error: "Access denied: Insufficient role" });
    }
    next();
  };
};

module.exports = { authUser, authRole };
