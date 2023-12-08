const axios = require("axios");

const GetSeamlessGameList = async (req, res) => {
  const payload = req.body;
  const { page = 1, limit = 10 } = req.query; // Default page is 1 and limit is 10, you can adjust these values

  try {
    let data = await axios.post(
      "https://ex-api-demo-yy.568win.com/web-root/restricted/information/get-game-list.aspx",
      payload
    );

    // console.log(data)

    let totalGames = data?.data?.seamlessGameProviderGames.length || 0;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Implementing pagination
    data = (data?.data?.seamlessGameProviderGames || []).slice(
      startIndex,
      endIndex
    );

    console.log(page,limit, "lll")

    return res.status(200).json({
      status: 200,
      success: true,
      data: data,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalGames / limit),
        totalItems: totalGames,
        limit
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      error: error.message,
    });
  }
};

const CasinoLogin = async (req, res) => {
  const payload = req.body;
  console.log(payload)
  try {
    let data = await axios.post(
      "https://ex-api-demo-yy.568win.com/web-root/restricted/player/login.aspx",
      payload
    );
    return res.status(200).json({
      status: 200,
      success: true,
      data: data.data,
      message: "Login Succesfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

module.exports = { GetSeamlessGameList, CasinoLogin };
