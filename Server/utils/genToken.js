const jwt = require("jsonwebtoken");
require("dotenv").config();

const getToken = async (email) => {
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
  return token;
};

module.exports = getToken;
