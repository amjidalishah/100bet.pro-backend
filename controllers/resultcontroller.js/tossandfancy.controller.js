const mongoose = require("mongoose");
const { BetModel } = require("../../models/bet.model");
const User = require("../../models/user.model");

async function ProcessTossAndFancyBets(req, res) {
  try {
    const { answer, user_ids } = req.body; // Get the answer and user_ids from the request body

    // Convert user_ids to an array of ObjectId objects
    const userIdObjects = user_ids.map(
      (userId) => new mongoose.Types.ObjectId(userId)
    );

    // Step 1: Find all bets with match_category "toss" or "fancy," result "pending," and matching _id
    const betsToUpdate = await BetModel.find({
      bet_category: { $in: ["toss", "fancy"] },
      result: "pending",
      _id: { $in: userIdObjects },
    });
    console.log(answer, user_ids, userIdObjects[0], betsToUpdate);
    // Step 2: Iterate through each bet and check if the answer matches
    for (const bet of betsToUpdate) {
      const user = await User.findOne({ user_id: bet.user_id });
      if (answer == "win") {
        // Set the bet result to "win"
        bet.result = "win";
        console.log("update");
        // Find the user by user_id

        if (user) {
          // Update the user's exposure limit and amount based on the result
          user.exposure_limit -= bet.stake_or_liability;
          // Calculate the user's new amount (multiplied by 1.8 for a win)
          user.amount += bet.stake_or_liability;
          // Save the updated user data
        }
      } else if (answer == "lose") {
        // Set the bet result to "lose" if the answer doesn't match
        bet.result = "lose";

        if (user) {
          user.exposure_limit -= bet.stake_or_liability;
          user.amount -= bet.stake_or_liability;
        }
      } else {
        // Set the bet result to "lose" if the answer doesn't match

        bet.result = "refund";

        if (user) {
          user.exposure_limit -= bet.stake_or_liability;
        }
      }

      await user.save();

      // Save the updated bet data
      await bet.save();
    }
    // Respond with a success message
    res.status(200).json({
      status: 200,
      success: true,
      message: "Bets Fancy/Toss result declaire successfully.",
    });
  } catch (error) {
    console.error("Error processing toss and fancy bets:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Failed to process bets",
    });
  }
}

module.exports = {
  ProcessTossAndFancyBets,
};
