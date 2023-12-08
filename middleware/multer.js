


const multer = require("multer");


const upload = multer({ storage: multer.memoryStorage() , limits: {
    fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
  },});





module.exports={upload}