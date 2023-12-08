const express = require("express");
const {
  GetBalance,
  Deduct,
  Settle,
  Rollback,
  Cancel,
  Bonus,
  ReturnStake,
  GetBetStatus,
} = require("../controllers/casino.controllers");

const CasinoRouter = express.Router();


CasinoRouter.post("/GetBalance", GetBalance);
CasinoRouter.post("/Deduct", Deduct);
CasinoRouter.post("/Settle", Settle);
CasinoRouter.post("/RollBack", Rollback);
CasinoRouter.post("/Cancel", Cancel);
CasinoRouter.post("/Bonus", Bonus);
CasinoRouter.post("/ReturnStake", ReturnStake);
CasinoRouter.post("/GetBetStatus", GetBetStatus);