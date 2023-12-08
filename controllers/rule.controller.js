const RulesRegulation = require("../models/rulesRegulation.model");


const AddGameRulesAndRegulation = async (req, res) => {
  try {
    // Create a new RulesRegulation document with data from the request body
    const newRulesRegulation = new RulesRegulation(req.body);

    // Save the document to the database
    const savedRulesRegulation = await new RulesRegulation.save();

    res.status(201).json({
      status: 201,
      success: true,
      data: savedRulesRegulation,
      message: "RulesRegulation added successfully.",
    });
  } catch (error) {
    console.error("Error adding RulesRegulation:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

// Route to update an existing RulesRegulation document
const UpdateRulesAndRegulation = async (req, res) => {
  try {
    const { id } = req.params;
    // Find the existing document by ID
    const existingRulesRegulation = await RulesRegulation.findOne({ _id: id });
    console.log(existingRulesRegulation);
    if (!existingRulesRegulation) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "RulesRegulation not found",
      });
    }

    // Update the document with data from the request body
    existingRulesRegulation.set(req.body);

    // Save the updated document
    const updatedRulesRegulation = await existingRulesRegulation.save();

    res.json({
      status: 200,
      success: true,
      data: updatedRulesRegulation,
      message: "RulesRegulation updated successfully.",
    });
  } catch (error) {
    console.error("Error updating RulesRegulation:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetRulesRegulation = async (req, res) => {
  try {
    let {id}= req.params
    const rulesRegulation = await RulesRegulation.findById({_id:id});
    if (!rulesRegulation) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Rules and regulations not found.",
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      data: rulesRegulation,
      message: "Rules and regulations retrieved successfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  AddGameRulesAndRegulation,
  UpdateRulesAndRegulation,
  GetRulesRegulation,
};
