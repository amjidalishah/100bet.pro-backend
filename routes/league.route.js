const express=require("express")
const { ToggleLeagueStatus, GetAllLeagues, UpdateLeagueLogo } = require("../controllers/league.controller")


const LeagueRoute=express.Router()

LeagueRoute.get("/get-all-league", GetAllLeagues)
LeagueRoute.patch("/update-league-status/:league_id", ToggleLeagueStatus)
LeagueRoute.patch("/update-league-logo/:league_id", UpdateLeagueLogo)

module.exports={LeagueRoute}