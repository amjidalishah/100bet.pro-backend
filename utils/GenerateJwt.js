const jwt = require("jsonwebtoken");
require("dotenv").config()
const GenrateJwtToken = (payload) => {
  return jwt.sign(payload,process.env.SECRET_KEY);
};

module.exports={
    GenrateJwtToken
}