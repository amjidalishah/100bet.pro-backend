const LogoFav = require("../models/logofavandmarque.model");

const UpdateLogoFav = async (req, res) => {
  try {
    const { id } = req.params;
    // Find the market document by ID
    const payload = req.body;
    const logo = await LogoFav.findOneAndUpdate({ _id: id }, payload, {
      new: true,
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: "Logofav details update successfully",
      data: logo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetLogoFav = async (req, res) => {
    try {
      const { id } = req.params;
      const logo = await LogoFav.findOne({ _id: id });
  
      res.status(200).json({
        status: 200,
        success: true,
        message: "Logofav details retrived successfully",
        data: logo,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        success: false,
        message: error.message,
      });
    }
  };
module.exports={UpdateLogoFav, GetLogoFav}