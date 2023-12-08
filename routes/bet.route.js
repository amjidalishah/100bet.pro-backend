const express = require("express");
const { GetAllBet, GetAllBetByUserId, PlaceBet, UpdateExposureLimit, PlaceBetAndUpdateExposure, GetAllBetsForResult } = require("../controllers/bet.controller");

const BetRouter = express.Router();

BetRouter.get("/get-all-bet", GetAllBet);
BetRouter.get("/get-all-bet/:user_id", GetAllBetByUserId);
BetRouter.post("/place-bet", PlaceBet);
BetRouter.post("/place-sport-bet", PlaceBetAndUpdateExposure);
BetRouter.post("/update-exposure-limit/:user_id", UpdateExposureLimit);
BetRouter.get("/get-all-bet-for-result", GetAllBetsForResult);



module.exports = { BetRouter };
