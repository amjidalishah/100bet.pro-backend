const express=require("express")
const { ToggleSportStatus,GetSport } = require("../controllers/sport.controller")

const SportRoute=express.Router()


SportRoute.get("/get-all-sport", GetSport)
SportRoute.patch("/update-sport-status/:sport_id", ToggleSportStatus)

module.exports={SportRoute}