

const jwt=require("jsonwebtoken")
require('dotenv').config()

const VerifyJwt = (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
        if (err) {
          console.log(err.token);
          reject("Invalid token");
        } else {
          // console.log(decodedToken, "decode");
          resolve(decodedToken)
        }
      });
    });
  };

module.exports={
    VerifyJwt
}