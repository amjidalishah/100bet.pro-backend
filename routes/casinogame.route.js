const express=require("express");
const { GetSeamlessGameList, CasinoLogin } = require("../controllers/casinogame.controller");

const CasinoGameRoute = express.Router();


CasinoGameRoute.post("/get-seamless-game",GetSeamlessGameList);
CasinoGameRoute.post("/login-casino",CasinoLogin);
// CasinoGameRoute.post("/get-pl-commission",GetPlAndCommission);
// GetPlAndCommission

module.exports={CasinoGameRoute}