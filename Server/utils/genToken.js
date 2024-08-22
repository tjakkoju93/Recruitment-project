const jwt = require("jsonwebtoken");
require("dotenv").config();

const getToken = async (id,user_role) => {
  const token = jwt.sign({ id ,user_role}, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
  return token;
};

module.exports = getToken;
