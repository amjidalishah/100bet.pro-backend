const mongoose = require("mongoose");
const { BetModel } = require("../model/bethistory.model");
const { UserModel } = require("../model/user.model");
const MatchModel = require("../model/match.model");
// Controller function to calculate and update exposure for a match
async function ResultDeclaireForBookmaker(req, res) {
  try {
    const { match_id } = req.params;
    const { runner1, runner2, team, type } = req.body;

    const allBetsForMatch = await BetModel.find({
      match_id: match_id,
      bet_category: { $in: ["bookmaker", "odds"] },
    });

    const uniqueUserIds = [
      ...new Set(allBetsForMatch.map((bet) => bet.user_id)),
    ];

    await Promise.all(
      uniqueUserIds.map(async (userId) => {
        const userBetsForMatch = allBetsForMatch.filter(
          (bet) => bet.user_id === userId
        );

        // Step 4: Calculate exposure based on user's bets

        let l2 = 0;
        let l1 = 0;
        let exposure = 0;
        for (const bet of userBetsForMatch) {
          // if (bet.length <= 0) {
          //   return;
          // }

          if (bet.team === runner1 && bet.bet_type === "back") {
            l2 -= bet.stake;
            l1 += bet.stake * bet.rate - bet.stake;
          }
          if (bet.team === runner1 && bet.bet_type === "lay") {
            l1 -= Math.floor(bet.stake * bet.rate - bet.stake);
            l2 += bet.stake;
          }
          if (bet.team === runner2 && bet.bet_type === "back") {
            l2 += Math.floor(bet.stake * bet.rate);
            l2 -= bet.stake;
            l1 -= bet.stake;
          }
          if (bet.team === runner2 && bet.bet_type === "lay") {
            l2 -= Math.floor(bet.stake * bet.rate) - bet.stake;
            l1 += bet.stake;
          }
        }
        // You can add more logic here for other bet types

        // Step 5: Update the user's amount and exposure

        const user = await UserModel.findOne({ user_id: userId });
        // console.log(l1, l2, runner1, runner2);
        if (runner1 == team) {
          if (l1 < 0) {
            if (user) {
              user.amount -= -1 * l1; // Update the user's amount
              user.exposure_limit -= -1 * l1; // Update the user's exposure
              await user.save();
            }
          } else if (l1 >= 0) {
            if (user) {
              user.amount += l1; // Update the user's amount
              user.exposure_limit -= -1 * l2; // Update the user's exposure
              await user.save();
            }
          }
        } else if (runner2 == team) {
          if (l2 < 0) {
            if (user) {
              user.amount -= -1 * l2; // Update the user's amount
              user.exposure_limit -= -1 * l2; // Update the user's exposure
              await user.save();
            }
          } else if (l2 >= 0) {
            if (user) {
              user.amount += l2; // Update the user's amount
              user.exposure_limit -= -1 * l1; // Update the user's exposure
              await user.save();
            }
          }
        }
        // console.log(l1, l2);
      })
    );

    const updaatedBets = await BetModel.updateMany(
      {
        match_id: match_id,
        bet_category: { $in: ["bookmaker", "odds"] },
      },
      {
        result: "declaired",
        team: team,
      }
    );

    let match = await MatchModel.findOneAndUpdate(
      { match_id },
      { result: "declaired", winner: team },
      { new: true }
    );
    // Respond with a success message
    res.status(200).json({
      status: 200,
      success: true,
      data: { match, updaatedBets },
      message: "Exposure and amount updated successfully",
    });
  } catch (error) {
    // Handle any unexpected errors during the process
    console.error("Error during exposure calculation and update:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "An unexpected error occurred",
    });
  }
}

async function ResultDeclaireTossAndFancyBets(req, res) {
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
      const user = await UserModel.findOne({ user_id: bet.user_id });
      if (answer == "win") {
        // Set the bet result to "win"
        bet.result = "win";
        console.log("update");
        // Find the user by user_id

        if (user) {
          // Update the user's exposure limit and amount based on the result
          user.exposure_limit -= bet.stake;
          // Calculate the user's new amount (multiplied by 1.8 for a win)
          user.amount += bet.stake;
          // Save the updated user data
        }
      } else if (answer == "lose") {
        // Set the bet result to "lose" if the answer doesn't match
        bet.result = "lose";

        if (user) {
          user.exposure_limit -= bet.stake;
          user.amount -= bet.stake;
        }
      } else {
        // Set the bet result to "lose" if the answer doesn't match

        bet.result = "refund";

        if (user) {
          user.exposure_limit -= bet.stake;
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
  ResultDeclaireForBookmaker,
  ResultDeclaireTossAndFancyBets,
};
