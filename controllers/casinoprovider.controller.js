const CasinoProvider = require("../models/casinoprovider.model");

const ToggleProvider = async (req, res) => {
  try {
    const { id } = req.params;
    // Find the market document by ID
    const provider = await CasinoProvider.findOne({ _id: id });
    if (!provider) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Provider not found.",
      });
    }

    provider.status = provider.status === false ? true : false;
    await provider.save();
    res.status(200).json({
      status: 200,
      success: true,
      message: "Status toggled successfully.",
      data: provider,
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

const GetProvider = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { gameName: { $regex: new RegExp(search, "i") } },
          { gpName: { $regex: new RegExp(search, "i") } },
        ],
      };
    }

    const allProviders = await CasinoProvider.find(query);
    const totalCount = await CasinoProvider.countDocuments();
    const activeProviders = await CasinoProvider.countDocuments({
      status: true,
    });
    const inactiveProviders = await CasinoProvider.countDocuments({
      status: false,
    });

    if (!allProviders || allProviders.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Provider not found.",
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Provider retrieved successfully.",
      data: allProviders,
      providerCounts: {
        activeCount: activeProviders,
        inactiveCount: inactiveProviders,
        totalCount: totalCount,
      },
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

module.exports = { ToggleProvider, GetProvider };
