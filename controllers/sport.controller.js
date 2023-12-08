const { SportModel } = require("../models/sport.model");

const ToggleSportStatus = async (req, res) => {
    try {
      const { sport_id } = req.params;
      // Find the market document by ID
      const market = await SportModel.findOne({ sport_id: sport_id });
      // Toggle the status
    console.log(market)
      market.status = market.status === true ? false : true;
  
      // // Save the updated market document
      await market.save();
  
      res.status(200).json({
        status: 200,
        success: true,
        message: "Status toggled successfully",
        data: market,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        success: false,
        message: error.message
      });
    }
  };
  
  
  
  const GetSport = async (req, res) => {
    try {
      const { search } = req.query;
      // Fetch leagues based on the query
      const sports = await SportModel.find();
      res.status(200).json({
        status: 200,
        success: true,
        message: "Sport retrieved successfully",
        data: sports,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        success: false,
        message:error.message
      });
    }
  };

  module.exports={GetSport, ToggleSportStatus}