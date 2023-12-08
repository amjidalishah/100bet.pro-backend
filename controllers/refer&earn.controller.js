const { findOneAndUpdate, findOne } = require("../models/casino.model");
const DepositModel = require("../models/deposit.model");
const ReferAndEarn = require("../models/refer&earn.model");
const User = require("../models/user.model");
const WithdrawModel = require("../models/withdraw.model");
const { GetCurrentTime } = require("../utils/GetCurrentTime");

const AddReferalCode = async (req, res) => {
  const { referral_code, username, user_id } = req.body;
  console.log(referral_code, username)
  try {
    const user = await User.findOneAndUpdate(
      { referral_code: referral_code },
      { $push: { referred_users: username } }
    );
    if (!user) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Invalid code.",
      });
    }
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { refer_by: user.username, refer_by_Code: referral_code },
      { new: true }
    );
    return res.status(200).json({
      status: 200,
      success: false,
      data: updatedUser,
      message: "Referal code applied sucessfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const SettleReferAndEarn = async (req, res) => {
  try {
    // getting all user
    const user = await User.find();
    let amount = 0;
    let total_deposit = 0;
    let total_withdraw = 0;
    console.log(user);

    // map all user
    for (let u = 0; u < user.length; u++) {
      // getting all referal_users
      let referred_users = user[u].referred_users;
      // map all referel_users

      for (let r = 0; r < referred_users.length; r++) {
        // get perticular user
        let single_user = await User.findOne({ user_id: user[u].user_id });
        // get rest amount of that user
        rest_amount = single_user.amount;
        let total_deposit = await CalculateDepositAmount(referred_users[r]);
        let total_withdraw = await CalculateWithdrawAmount(referred_users[r]);

        // if referal of perticular user not exit.
        let user_referal_details = await ReferAndEarn.findOne({
          user_id: user[u].user_id,
        });
        if (!user_referal_details) {
          const [referal_amount, total_loss] = CalculatePercentageOfAmount(
            total_deposit,
            total_withdraw,
            rest_amount,
            user[u].username,
            0
          );
          console.log(referal_amount, total_loss);
          const refer_payload = {
            username: user[u].username,
            user_id: user[u].user_id,
            referal_code: user[u].referral_code,
            timestamp: GetCurrentTime(),
            last_loss_amount: total_loss,
            total_referal_amount: total_loss,
          };

          let refer_earn = new ReferAndEarn(refer_payload);
          await refer_earn.save();
          user[u].amount = user[u].amount + referal_amount;
          await user[u].save();
        }
        // if referal of perticular user exit.
        else if (user_referal_details) {
          const [referal_amount, total_loss] = CalculatePercentageOfAmount(
            total_deposit,
            total_withdraw,
            rest_amount,
            user[u].username,
            user_referal_details.previous_loss
          );
          console.log(referal_amount, total_loss);
          user_referal_details.last_loss_amount = total_loss;
          user_referal_details.previous_loss = total_loss;
          await user_referal_details.save();
          let previous_loss = user_referal_details.previous_loss;
          user[u].amount = user[u].amount + referal_amount;
          await user[u].save();
        }
      }
    }
    res.status(200).json({
      status: 200,
      success: false,
      data: user,
      message: "Refer and earn credit successfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const CalculateWithdrawAmount = async (user_id) => {
  const totalWithdrawAmount = await WithdrawModel.aggregate([
    {
      $match: { user_id: user_id, status: "approved" }, // Filter by user_id
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$withdraw_amount" }, // Calculate the sum of the 'amount' field
      },
    },
  ]);
  // 'totalWithdrawAmount' will be an array with one object containing the total amount
  console.log(totalWithdrawAmount);
  const totalAmount =
    totalWithdrawAmount.length > 0 ? totalWithdrawAmount[0].totalAmount : 0;
  return totalAmount;
};

const CalculateDepositAmount = async (user_id) => {
  const totalWithdrawAmount = await DepositModel.aggregate([
    {
      $match: { user_id: user_id, status: "approved" }, // Filter by user_id
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$deposit_amount" }, // Calculate the sum of the 'amount' field
      },
    },
  ]);
  // 'totalWithdrawAmount' will be an array with one object containing the total amount
  const totalAmount =
    totalWithdrawAmount.length > 0 ? totalWithdrawAmount[0].totalAmount : 0;
  return totalAmount;
};

const CalculatePercentageOfAmount = (
  deposit,
  withdraw,
  rest_amount,
  username,
  previous_loss
) => {
  let percentage = 25;
  let total_loss = Math.abs(Math.abs(deposit - withdraw) - rest_amount);
  let updated_loss = Math.abs(previous_loss - total_loss);
  return [Math.round((updated_loss / 100) * percentage), total_loss];
};

module.exports = { AddReferalCode, SettleReferAndEarn };
