const CasinoModel = require("../models/casino.model");
const UserModel = require("../models/user.model");
const { GetCurrentTime } = require("../utils/GetCurrentTime");
require("dotenv").config();
const GetBalance = async (req, res) => {
  try {
    const { CompanyKey, Username, GameType, GpId, ProductType } = req.body;

    if (!Username) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 3,
        ErrorMessage: "Username empty",
      });
    }

    if (!CompanyKey || CompanyKey !== process.env.COMPANY_KEY) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 4,
        ErrorMessage: "CompanyKey Error",
      });
    }

    // Find the user by user_id and update their exposure_limit
    const User = await UserModel.findOne({ username: Username });
    if (!User) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 1,
        ErrorMessage: "Member not exist",
      });
    }
    if (User) {
      return res.status(200).json({
        Balance: User.amount.toFixed(1),
        AccountName: User.username,
        ErrorCode: 0,
        ErrorMessage: "No Error",
      });
    }
  } catch (error) {
    return res.status(200).json({
      Balance: 0.0,
      AccountName: "",
      ErrorCode: 7,
      ErrorMessage: "Internal Error",
      error: error.message,
    });
  }
};

const Deduct = async (req, res) => {
  try {
    const {
      CompanyKey = "",
      Username = "",
      GameType = "",
      GpId = null,
      GameId = null,
      ProductType = "",
      ExtraInfo = {},
      TransferCode = null,
      Amount = 0,
      TransactionId = "",
      BetTime = "",
      GameRoundId = null,
      GamePeriodId = null,
      OrderDetail = "",
      PlayerIp = "",
      GameTypeName = null,
    } = req.body;

    const User = await UserModel.findOne({ username: Username });
    const payload = {
      CompanyKey,
      Username,
      GameType,
      GpId,
      GameId,
      ProductType,
      ExtraInfo,
      TransferCode,
      Amount,
      TransactionId,
      BetTime: GetCurrentTime(),
      GameRoundId,
      GamePeriodId,
      OrderDetail,
      PlayerIp,
      GameTypeName,
      UserId: User.user_id || "",
    };
    if (!Username) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 3,
        ErrorMessage: "Username empty",
        BetAmount: Amount,
      });
    }

    if (!CompanyKey || CompanyKey !== process.env.COMPANY_KEY) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 4,
        ErrorMessage: "CompanyKey Error",
      });
    }

    // Find the user by user_id and update their exposure_limit

    if (!User) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 1,
        ErrorMessage: "Member not exist",
        BetAmount: Amount,
      });
    }

    let casino = await CasinoModel.find({
      TransactionId,
      Username,
    });
    if (ProductType === 1 || ProductType == 5 || ProductType == 9) {
      if (casino.length > 0) {
        if (casino[casino.length - 1].Status == "void") {
          return res.status(200).json({
            Balance: 0.0,
            AccountName: "",
            ErrorCode: 5003,
            ErrorMessage: "Bet With Same RefNo Exists",
          });
        } else if (casino[casino.length - 1].Status == "settled") {
          return res.status(200).json({
            Balance: 0.0,
            AccountName: "",
            ErrorCode: 5003,
            ErrorMessage: "Bet With Same RefNo Exists",
          });
        } else {
          return res.status(200).json({
            Balance: 0.0,
            AccountName: "",
            ErrorCode: 5003,
            ErrorMessage: "Bet With Same RefNo Exists",
          });
        }
      }
    } else if (ProductType === 3 || ProductType === 7) {
      if (casino.length > 0 && casino[casino.length - 1].Status == "void") {
        return res.status(200).json({
          Balance: 0.0,
          AccountName: "",
          ErrorCode: 5003,
          ErrorMessage: "Bet With Same RefNo Exists",
        });
      } else if (
        casino.length > 0 &&
        casino[casino.length - 1].Status == "settled"
      ) {
        return res.status(200).json({
          Balance: 0.0,
          AccountName: "",
          ErrorCode: 5003,
          ErrorMessage: "Bet With Same RefNo Exists",
        });
      }

      if (casino.length > 0 && casino[casino.length - 1].Amount >= Amount) {
        return res.status(200).json({
          Balance: 0.0,
          AccountName: "",
          ErrorCode: 7,
          ErrorMessage: "Internal Error",
          BetAmount: Amount,
        });
      }
    }

    if (User.amount >= Amount) {
      if (casino.length > 0) {
        let prev_amount = casino[casino.length - 1].Amount;
        let data = await CasinoModel.findOneAndUpdate(
          {
            TransactionId,
            Username,
          },
          payload
        );
        User.amount -= Math.abs(Amount - prev_amount);
        await User.save();
        console.log("dd", User.amount);
        return res.status(200).json({
          Balance: User.amount.toFixed(1),
          AccountName: User.username,
          ErrorCode: 0,
          ErrorMessage: "No Error",
          BetAmount: Amount,
        });
      } else {
        let casino = new CasinoModel(payload);
        await casino.save();
        User.amount -= Amount;
        await User.save();
        return res.status(200).json({
          Balance: User.amount.toFixed(1),
          AccountName: User.username,
          ErrorCode: 0,
          ErrorMessage: "No Error",
          BetAmount: Amount,
        });
      }
    } else if (User.amount < Amount) {
      return res.status(200).json({
        Balance: User.amount.toFixed(1),
        AccountName: User.username,
        ErrorCode: 5,
        ErrorMessage: "Not enough balance",
        BetAmount: Amount,
      });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: "",
        ErrorCode: 5003,
        ErrorMessage: "Bet With Same RefNo Exists",
      });
    } else
      return res.status(200).json({
        Balance: 0.0,
        AccountName: "",
        ErrorCode: 7,
        ErrorMessage: "Internal Error",
        error: error.message,
      });
  }
};

const Settle = async (req, res) => {
  try {
    const {
      CompanyKey,
      Username,
      GameType,
      GpId,
      WinLoss,
      ProductType,
      ExtraInfo,
      TransferCode,
      ResultType,
      ResultTime = "",
      Amount = 0,
      CommissionStake = "",
      IsCashOut = true,
    } = req.body;

    if (!Username) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 3,
        ErrorMessage: "Username empty",
        BetAmount: Amount,
      });
    }

    if (!CompanyKey || CompanyKey !== process.env.COMPANY_KEY) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 4,
        ErrorMessage: "CompanyKey Error",
      });
    }

    // Find the user by user_id and update their exposure_limit
    const User = await UserModel.findOne({ username: Username });
    if (!User) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 1,
        ErrorMessage: "Member not exist",
        BetAmount: Amount,
      });
    }
    if (User) {
      let casino = await CasinoModel.find({
        TransferCode,
        Username,
      });
      if (casino.length === 0) {
        return res.status(200).json({
          Balance: User.amount.toFixed(1),
          AccountName: User.username,
          ErrorCode: 6,
          ErrorMessage: "Bet not exists",
        });
      }

      let voidCount = 0;
      let settledCount = 0;
      for (let f = 0; f < casino.length; f++) {
        const currentCasino = casino[f];
        if (currentCasino.Status === "settled") {
          settledCount++;
        } else if (currentCasino.Status === "running") {
          currentCasino.ResultType = ResultType;
          currentCasino.ResultTime = ResultTime;
          currentCasino.GameType = GameType;
          currentCasino.GpId = GpId;
          currentCasino.WinLoss = WinLoss;
          currentCasino.ProductType = ProductType;
          currentCasino.ExtraInfo = ExtraInfo;
          currentCasino.IsCashOut = IsCashOut;
          currentCasino.CommissionStake = CommissionStake;
          currentCasino.Status = "settled";

          await currentCasino.save();
        } else {
          voidCount++;
        }
      }
      if (voidCount === casino.length) {
        return res.status(200).json({
          Balance: User.amount.toFixed(1),
          AccountName: User.username,
          ErrorCode: 2002,
          ErrorMessage: "Bet Already Canceled",
        });
      }

      if (settledCount === casino.length) {
        return res.status(200).json({
          Balance: User.amount.toFixed(1),
          AccountName: User.username,
          ErrorCode: 2001,
          ErrorMessage: "Bet Already Settled",
        });
      }

      User.amount += WinLoss;
      await User.save();
      return res.status(200).json({
        Balance: User.amount.toFixed(1),
        AccountName: User.username,
        ErrorCode: 0,
        ErrorMessage: "No Error",
      });
    }
  } catch (error) {
    return res.status(200).json({
      Balance: 0.0,
      AccountName: "",
      ErrorCode: 7,
      ErrorMessage: "Internal Error",
      error: error.message,
    });
  }
};

const Rollback = async (req, res) => {
  try {
    const {
      CompanyKey,
      Username,
      GameType,
      TransferCode,
      GpId,
      ProductType,
      ExtraInfo,
    } = req.body;
    if (!Username) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 3,
        ErrorMessage: "Username empty",
      });
    }

    if (!CompanyKey || CompanyKey !== process.env.COMPANY_KEY) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 4,
        ErrorMessage: "CompanyKey Error",
      });
    }

    // Find the user by user_id and update their exposure_limit
    const User = await UserModel.findOne({ username: Username });
    if (!User) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 1,
        ErrorMessage: "Member not exist",
      });
    }
    if (User) {
      let casino = await CasinoModel.find({
        TransferCode,
        Username,
      });

      if (casino.length === 0) {
        return res.status(200).json({
          Balance: User.amount.toFixed(1),
          AccountName: User.username,
          ErrorCode: 6,
          ErrorMessage: "Bet not exists",
        });
      }
      for (let i = 0; i < casino.length; i++) {
        const casinoData = casino[i];
        if (casinoData.Status === "settled") {
          User.amount = User.amount - casinoData.WinLoss;
          await User.save();
          casinoData.Status = "running";
          await casinoData.save();
        } else if (casinoData.Status === "void") {
          User.amount = User.amount - Math.abs(casinoData.Amount);
          await User.save();
          casinoData.Status = "running";
          await casinoData.save();
        } else if (casinoData.Status === "running") {
          return res.status(200).json({
            Balance: User.amount.toFixed(1),
            AccountName: User.username,
            ErrorCode: 2003,
            ErrorMessage: "Bet Already Rollback",
          });
        }
      }
      return res.status(200).json({
        Balance: User.amount.toFixed(1),
        AccountName: User.username,
        ErrorCode: 0,
        ErrorMessage: "No Error",
      });
    }
  } catch (error) {
    return res.status(200).json({
      Balance: 0,
      AccountName: "",
      ErrorCode: 7,
      ErrorMessage: "Internal Error",
    });
  }
};

const Cancel = async (req, res) => {
  try {
    const {
      CompanyKey,
      Username,
      GameType,
      TransferCode,
      GpId,
      IsCancelAll,
      TransactionId,
      ProductType,
      ExtraInfo,
    } = req.body;
    if (!Username) {
      return res.status(200).json({
        Balance: 0,
        AccountName: Username,
        ErrorCode: 3,
        ErrorMessage: "Username empty",
      });
    }
    if (!CompanyKey || CompanyKey !== process.env.COMPANY_KEY) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 4,
        ErrorMessage: "CompanyKey Error",
      });
    }

    const User = await UserModel.findOne({ username: Username });
    if (!User) {
      return res.status(200).json({
        Balance: 0,
        AccountName: Username,
        ErrorCode: 1,
        ErrorMessage: "Member not exist",
      });
    }
    if (User) {
      // here a condition will add for IsCancelAll
      if (IsCancelAll) {
        let casino = await CasinoModel.find({
          TransferCode,
          Username,
        });

        if (casino.length === 0) {
          return res.status(200).json({
            Balance: User.amount.toFixed(1),
            AccountName: User.username,
            ErrorCode: 6,
            ErrorMessage: "Bet not exists",
          });
        }
        let total = 0;
        for (let i = 0; i < casino.length; i++) {
          const casinoData = casino[i];
          if (casinoData.Status === "settled") {
            casinoData.Status = "void";
            await casinoData.save();
            total += casinoData.Amount;
          } else if (casinoData.Status === "running") {
            User.amount = User.amount + casinoData.Amount;
            await User.save();
            casinoData.Status = "void";
            await casinoData.save();
          } else {
            return res.status(200).json({
              Balance: User.amount.toFixed(1),
              AccountName: User.username,
              ErrorCode: 2002,
              ErrorMessage: "Bet Already Canceled",
            });
          }
        }
        User.amount = User.amount - Math.abs(total - casino[0].WinLoss);
        await User.save();
        return res.status(200).json({
          Balance: User.amount.toFixed(1),
          AccountName: User.username,
          ErrorCode: 0,
          ErrorMessage: "No Error",
        });
      } else if (!IsCancelAll) {
        // here a condition will add for !IsCancelAll
        let casino = await CasinoModel.findOne({
          TransferCode,
          TransactionId,
          Username,
        });

        if (!casino) {
          return res.status(200).json({
            Balance: User.amount.toFixed(1),
            AccountName: User.username,
            ErrorCode: 6,
            ErrorMessage: "Bet not exists",
          });
        }
        if (casino.Status === "settled") {
          User.amount =
            User.amount - Math.abs(casinoData.WinLoss - casinoData.Amount);
          await User.save();
          casino.Status = "void";
          await casino.save();
          return res.status(200).json({
            Balance: User.amount.toFixed(1),
            AccountName: User.username,
            ErrorCode: 0,
            ErrorMessage: "No Error",
          });
        } else if (casino.Status === "running") {
          User.amount = User.amount + casino.Amount;
          await User.save();
          casino.Status = "void";
          await casino.save();
          return res.status(200).json({
            Balance: User.amount.toFixed(1),
            AccountName: User.username,
            ErrorCode: 0,
            ErrorMessage: "No Error",
          });
        } else {
          return res.status(200).json({
            Balance: User.amount.toFixed(1),
            AccountName: User.username,
            ErrorCode: 2002,
            ErrorMessage: "Bet Already Canceled",
          });
        }
      }
    }
  } catch (error) {
    return res.status(200).json({
      Balance: 0.0,
      AccountName: "",
      ErrorCode: 7,
      ErrorMessage: "Internal Error",
      error: error.message,
    });
  }
};

const Bonus = async (req, res) => {
  const {
    CompanyKey = "",
    Username = "",
    Amount = 0,
    BonusTime = "",
    BetTime = "",
    ProductType = 0,
    IsGameProviderPromotion = null,
    GameType = "",
    TransactionId = "",
    TransferCode = "",
    GameId = null,
    Gpid,
  } = req.body;

  const payload = {
    CompanyKey,
    Username,
    Amount,
    BonusTime,
    BetTime,
    ProductType,
    IsGameProviderPromotion,
    GameType,
    TransactionId,
    TransferCode,
    GameId,
    Gpid,
  };
  try {
    if (!Username) {
      return res.status(200).json({
        Balance: 0,
        AccountName: Username,
        ErrorCode: 3,
        ErrorMessage: "Username empty",
      });
    }

    if (!CompanyKey || CompanyKey !== process.env.COMPANY_KEY) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 4,
        ErrorMessage: "CompanyKey Error",
      });
    }

    // Find the user by user_id and update their exposure_limit
    const User = await UserModel.findOne({ username: Username });
    if (!User) {
      return res.status(200).json({
        Balance: 0,
        AccountName: Username,
        ErrorCode: 1,
        ErrorMessage: "Member not exist",
      });
    }

    if (User) {
      let casino = await CasinoModel.findOne({
        TransferCode,
        TransactionId,
        Username,
      });

      if (casino) {
        return res.status(200).json({
          Balance: 0.0,
          AccountName: "",
          ErrorCode: 5003,
          ErrorMessage: "Bet With Same RefNo Exists",
        });
      }
      if (!casino) {
        let casino = new CasinoModel(payload);
        await casino.save();
        User.amount = User.amount + Amount;
        await User.save();
        return res.status(200).json({
          AccountName: User.username,
          Balance: User.amount,
          ErrorCode: 0,
          ErrorMessage: "No Error",
        });
      }
    }
  } catch (error) {
    return res.status(200).json({
      AccountName: Username,
      Balance: 0,
      ErrorCode: 7,
      ErrorMessage: "Internal Error",
    });
  }
};

const ReturnStake = async (req, res) => {
  const {
    CompanyKey,
    Username,
    GameType,
    ProductType,
    CurrentStake,
    ReturnStakeTime,
    TransactionId,
    TransferCode,
  } = req.body;
  try {
    if (!Username) {
      return res.status(200).json({
        Balance: 0,
        AccountName: Username,
        ErrorCode: 3,
        ErrorMessage: "Username empty",
      });
    }

    if (!CompanyKey || CompanyKey !== process.env.COMPANY_KEY) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 4,
        ErrorMessage: "CompanyKey Error",
      });
    }

    // Find the user by user_id and update their exposure_limit
    const User = await UserModel.findOne({ username: Username });
    if (!User) {
      return res.status(200).json({
        Balance: 0,
        AccountName: Username,
        ErrorCode: 1,
        ErrorMessage: "Member not exist",
      });
    }

    if (User) {
      let casino = await CasinoModel.findOne({
        TransferCode,
        TransactionId,
        Username,
      });

      if (!casino) {
        return res.status(200).json({
          AccountName: User.username,
          Balance: User.amount,
          ErrorCode: 6,
          ErrorMessage: "Bet not exists",
        });
      }

      if (casino.Status == "void") {
        return res.status(200).json({
          AccountName: User.username,
          Balance: User.amount,
          ErrorCode: 5003,
          ErrorMessage: "Bet With Same RefNo Exists",
        });
      }
      if (casino.ReturnStake !== 0) {
        return res.status(200).json({
          AccountName: User.username,
          Balance: User.amount,
          ErrorCode: 5008,
          ErrorMessage: "Bet Already Returned Stake",
        });
      }

      User.amount = User.amount + CurrentStake;
      await User.save();
      casino.Amount = casino.Amount - CurrentStake;
      casino.ReturnStake = CurrentStake;
      await casino.save();
      return res.status(200).json({
        AccountName: User.username,
        Balance: User.amount,
        ErrorCode: 0,
        ErrorMessage: "No Error",
      });
    }
  } catch (error) {
    return res.status(200).json({
      AccountName: Username,
      Balance: 0,
      ErrorCode: 7,
      ErrorMessage: "Internal Error",
    });
  }
};

const GetBetStatus = async (req, res) => {
  const {
    CompanyKey,
    Username,
    GameType,
    GpId,
    ProductType,
    TransactionId,
    TransferCode,
  } = req.body;
  try {
    if (!Username) {
      return res.status(200).json({
        Balance: 0,
        AccountName: Username,
        ErrorCode: 3,
        ErrorMessage: "Username empty",
      });
    }

    if (!CompanyKey || CompanyKey !== process.env.COMPANY_KEY) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 4,
        ErrorMessage: "CompanyKey Error",
      });
    }
    // Find the user by user_id and update their exposure_limit
    const User = await UserModel.findOne({ username: Username });
    if (!User) {
      return res.status(200).json({
        Balance: 0,
        AccountName: Username,
        ErrorCode: 1,
        ErrorMessage: "Member not exist",
      });
    }
    if (User) {
      let casino = await CasinoModel.findOne({
        TransferCode,
        TransactionId,
      });

      if (!casino) {
        return res.status(200).json({
          TransactionId: TransactionId,
          TransferCode: TransferCode,
          WinLoss: 0,
          ErrorCode: 6,
          ErrorMessage: "Bet not exists",
        });
      }
      return res.status(200).json({
        Stake: casino.Amount,
        Status: casino.Status,
        TransactionId: casino.TransactionId,
        TransferCode: casino.TransferCode,
        WinLoss: casino.WinLoss,
        ErrorCode: 0,
        ErrorMessage: "No Error",
      });
    }
  } catch (error) {
    return res.status(200).json({
      Balance: 0,
      ErrorCode: 7,
      ErrorMessage: "Internal Error",
      TransactionId: TransactionId,
      TransferCode: TransferCode,
    });
  }
};

module.exports = {
  GetBalance,
  Deduct,
  Settle,
  Rollback,
  Cancel,
  Bonus,
  ReturnStake,
  GetBetStatus,
};
