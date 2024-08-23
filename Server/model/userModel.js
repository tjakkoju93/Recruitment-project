const pool = require("../connection/db");
const bcrypt = require("bcrypt");

const checkExistEmail = async (email) => {
  try {
    const existingUserQuery = `SELECT * FROM Employee_Employers WHERE email = ?`;
    const [existingUser] = await pool.query(existingUserQuery, email);
    return existingUser;
  } catch (error) {
    console.error("Error checking existing user:", error.message);
    throw error;
  }
};

const checkExistId = async (id) => {
  try {
    const existingUserQuery = `SELECT * FROM Employee_Employers WHERE id = ?`;
    const [existingUser] = await pool.query(existingUserQuery, id);
    return existingUser;
  } catch (error) {
    console.error("Error checking existing user:", error.message);
    throw error;
  }
};

const userModel = async (details) => {
  if (!details) {
    const query = "SELECT * FROM Employee_Employers";
    const data = await pool.query(query);
    return data;
  }
  const data = await checkExistId(details);
  return data;
};

const userCreateModel = async (data) => {
  const {
    first_name,
    last_name,
    email,
    password,
    mobile,
    role,
    company_name,
    location,
    technologies,
    experience,
    preferred_location,
    graduate,
    noticePeriod,
    address,
    user_role,
  } = data;

  try {
    const existingUser = await checkExistEmail(email);

    if (existingUser.length > 0) {
      throw new Error("User with this email already exists.");
    }

    const genSalt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, genSalt);

    const query = `INSERT INTO Employee_Employers (
      first_name,
      last_name,
      email,
      password,
      mobile,
      role,
      company_name,
      location,
      technologies,
      experience,
      preferred_location,
      graduate,
      noticePeriod,
      address,
      user_role
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await pool.query(query, [
      first_name,
      last_name,
      email,
      hash,
      mobile,
      role,
      company_name,
      location,
      technologies,
      experience,
      preferred_location,
      graduate,
      noticePeriod,
      address,
      user_role,
    ]);

    if (result.affectedRows < 1) {
      throw err;
    }
    const user = await checkExistEmail(email);
    return user;
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw error;
  }
};

const loginUserModel = async (email, password) => {
  try {
    const [user] = await checkExistEmail(email);
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw err;
    }
    return user;
  } catch (err) {
    res.status(400).send({ message: err });
  }
};

const updateUserModel = async (fields, values, email) => {
  const existingUser = await checkExistEmail(email);

  if (!existingUser) {
    throw new Error("User doesn't exists.");
  }

  const query = `UPDATE Employee_Employers SET
  ${fields.join(", ")} WHERE email = ?`;

  await pool.query(query, values);
  const [user] = await checkExistEmail(email);
  return user;
};

const deleteUserModel = async (id) => {
  const existingUserQuery = `select * from Employee_Employers where id = ?`;
  const existingUser = await pool.query(existingUserQuery, [id]);
  if (!existingUser) {
    throw new Error("User doesn't exists.");
  }
  const query = `delete from Employee_Employers WHERE id = ?`;
  const result = await pool.query(query, [id]);
  if (result[0].affectedRows == 0) {
    throw new Error("User deletetion unsuccessfull");
  }

  return true;
};

module.exports = {
  userModel,
  userCreateModel,
  updateUserModel,
  deleteUserModel,
  loginUserModel,
  checkExistEmail,
  checkExistId,
};
