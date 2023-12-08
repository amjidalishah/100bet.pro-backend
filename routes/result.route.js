const express=require("express");
const { ProcessTossAndFancyBets } = require("../controllers/resultcontroller.js/tossandfancy.controller");
const { DeclaireMatchResultAndUpdateExposure } = require("../controllers/resultcontroller.js/oddsandbookmaker.controller");
const ResultRouter=express.Router()

ResultRouter.patch("/update-result/:match_id",DeclaireMatchResultAndUpdateExposure);
// take match_ids in body  and answer
ResultRouter.patch("/update-fancy-toss-result",ProcessTossAndFancyBets);

module.exports={ResultRouter}