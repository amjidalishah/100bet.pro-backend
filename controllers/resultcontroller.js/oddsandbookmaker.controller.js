const { BetModel } = require("../../models/bet.model");
const MatchModel = require("../../models/match.model");
const User = require("../../models/user.model");

async function DeclaireMatchResultAndUpdateExposure(req, res) {
    try {
      const { match_id } = req.params;
      const { runner1, runner2, team, type } = req.body;
  
      const allBetsForMatch = await BetModel.find({
        match_id: match_id,
        bet_category: { $in: ["bookmaker", "odds"] },
      });
  
      // console.log(allBetsForMatch, runner1, runner2, team);
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
              l2 -= bet.stake_or_liability;
              l1 += bet.stake_or_liability * bet.odds - bet.stake_or_liability;
            }
            if (bet.team === runner1 && bet.bet_type === "lay") {
              l1 -= Math.floor(
                bet.stake_or_liability * bet.odds - bet.stake_or_liability
              );
              l2 += bet.stake_or_liability;
            }
            if (bet.team === runner2 && bet.bet_type === "back") {
              l2 += Math.floor(bet.stake_or_liability * bet.odds);
              l2 -= bet.stake_or_liability;
              l1 -= bet.stake_or_liability;
            }
            if (bet.team === runner2 && bet.bet_type === "lay") {
              l2 -=
                Math.floor(bet.stake_or_liability * bet.odds) -
                bet.stake_or_liability;
              l1 += bet.stake_or_liability;
            }
          }
          // You can add more logic here for other bet types
  
          // Step 5: Update the user's amount and exposure
  
          const user = await User.findOne({ user_id: userId });
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
          winner: team,
        }
      );
  
      let match = await MatchModel.findOneAndUpdate(
        { match_id },
        { result: "declaired", winner:team },
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
  

  module.exports={DeclaireMatchResultAndUpdateExposure}