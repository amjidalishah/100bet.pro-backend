const bcrypt = require("bcrypt");

const DecryptPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

module.exports={DecryptPassword}