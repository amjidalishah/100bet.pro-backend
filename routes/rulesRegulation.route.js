
const express=require("express");
const { UpdateRulesAndRegulation, GetRulesRegulation, AddGameRulesAndRegulation } = require("../controllers/rule.controller");
const RulesRegulation=express.Router()
RulesRegulation.post("/create-rules", AddGameRulesAndRegulation);
RulesRegulation.get("/get-rules/:id", GetRulesRegulation);
RulesRegulation.patch("/update-rules/:id", UpdateRulesAndRegulation)

module.exports={RulesRegulation}
