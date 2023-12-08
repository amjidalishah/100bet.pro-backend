const express = require("express");
const {
  ResultDeclaireForBookmaker,
  ResultDeclaireTossAndFancyBets,
} = require("../controllers/matchresult.controller");
const ResultRoute = express.Router();

ResultRoute.patch("/update-result/:match_id", ResultDeclaireForBookmaker);
ResultRoute.patch("/update-fancy-toss-result", ResultDeclaireTossAndFancyBets);

module.exports = { ResultRoute };
