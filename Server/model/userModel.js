const pool = require("../connection/db");

const userModel = async (req, res) => {
  const query = "SELECT * FROM Employee_Employers";
  const data = await pool.query(query);
  return data;
};

const userCreateModel = async (data, createdAt, updatedAt) => {
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
  } = data;

  console.log(email)
  const existingUserQuery = `select 1 from Employee_Employers where email = ?`;
  const existingUser = await pool.query(existingUserQuery, email);
  console.log(existingUserQuery,existingUser)

  if (existingUser) {
    throw new Error("User with this email already exists.");
  }

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
    createdAt,
    updatedAt
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const user = await pool.query(query, [
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
    createdAt,
    updatedAt,
  ]);

  return user;
};

const updateUserModel = async (fields, values, id) => {
  const existingUserQuery = `select email from Employee_Employers where id = ?`;
  const existingUser = await pool.query(existingUserQuery, [id]);

  if (!existingUser) {
    throw new Error("User doesn't exists.");
  }

  const query = `UPDATE Employee_Employers SET 
  ${fields.join(", ")} WHERE id = ?`;

  await pool.query(query, values);
  const userQuery = `select * from Employee_Employers where id = ?`;
  const user = await pool.query(userQuery, [id]);
  return user[0];
};

const deleteUserModel = async (id) => {
  const existingUserQuery = `select * from Employee_Employers where id = ?`;
  const existingUser = await pool.query(existingUserQuery, [id]);
  if (!existingUser) {
    throw new Error("User doesn't exists.");
  }
  const query = `delete from Employee_Employers WHERE id = ?`;
  await pool.query(query, [id]);

  if(!existingUser){
    throw new Error("User deleted successfully");
  }
  
};

module.exports = { userModel, userCreateModel, updateUserModel, deleteUserModel };
