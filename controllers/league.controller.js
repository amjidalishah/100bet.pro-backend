const LeagueModel = require("../models/league.model");
const { SportModel } = require("../models/sport.model");


const GetAllLeagues = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    // Check if the 'name' query parameter is provided
    if (req.query.name) {
      // If 'name' is provided, add it to the query
      query.name = { $regex: req.query.name, $options: "i" }; // Case-insensitive search
    }
    const sports = await SportModel.find({ status: true });
    const activeSports = sports.map((league) => league.sport_id);
    if (activeSports) {
      query.sport_id = { $in: activeSports };
    }
    // Query the database with pagination and optional search by name
    const leagues = await LeagueModel.find(query)
      .sort({ status: 1 }) // Sort by 'status' in descending order (-1 means 'active' will come first)
      .skip(skip)
      .limit(limit);

    const totalLeagues = await LeagueModel.countDocuments(query);

    const totalPages = Math.ceil(totalLeagues / limit);

    const pagination = {
      currentPage: page,
      totalPages,
      totalItems: totalLeagues,
      limit,
    };

    return res.status(200).json({
      status: 200,
      success: true,
      data: leagues,
      message: "Leagues retrieved successfully",
      pagination,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
       message:error.message,
    });
  }
};



const ToggleLeagueStatus = async (req, res) => {
  try {
    const { league_id } = req.params;
    // Find the market document by ID
    const league = await LeagueModel.findOne({ league_id: league_id });
    // Toggle the status

    league.status = league.status === false ? true : false;

    // // Save the updated market document
    await league.save();

    res.status(200).json({
      status: 200,
      success: true,
      message: "Status toggled successfully",
      data: league,
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





const UpdateLeagueLogo = async (req, res) => {
  try {
    const { league_id } = req.params;
    let payload = req.body;
    const match = await LeagueModel.findOneAndUpdate({ league_id }, payload, {
      new: true,
    });
    res.status(200).json({
      status: 200,
      success: true,
      message: "Update logo successfully",
      data: match,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

module.exports = { UpdateLeagueLogo, GetAllLeagues, ToggleLeagueStatus };
