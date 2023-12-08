const bcrypt = require("bcrypt");

// Middleware to encrypt passwords before saving to the database
const EncryptPassword = async (password) => {
  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));
      console.log(hashedPassword,"hash")
      return hashedPassword;
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// Middleware to compare provided password with the stored hashed password

module.exports = { EncryptPassword };
