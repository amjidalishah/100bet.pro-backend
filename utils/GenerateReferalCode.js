const crypto = require('crypto');
require("dotenv").config()
const SECRET_KEY = process.env.SECRET_KEY;
function GenerateReferralCode(userId, username) {
  const data = `${username}-${SECRET_KEY}`;
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  return hash.substr(0, 10).toUpperCase(); 
}


module.exports={GenerateReferralCode}

