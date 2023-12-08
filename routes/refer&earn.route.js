const express = require("express");
const { SettleReferAndEarn, AddReferalCode } = require("../controllers/refer&earn.controller");

const ReferAndEarnRoute=express.Router()

ReferAndEarnRoute.post("/apply-refer-code", AddReferalCode)
ReferAndEarnRoute.post("/settle-refer-amount", SettleReferAndEarn)

module.exports={ReferAndEarnRoute}