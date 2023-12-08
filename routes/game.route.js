const express = require("express");
const { ToggleSportStatus, GetAllSports, GetAllMatches, ToggleMatchStatus } = require("../controllers/game.controller");


const SportRouter = express.Router();
SportRouter.get("/get-all-sport", GetAllSports);
SportRouter.patch("/toggle-status/:sport_id", ToggleSportStatus);
SportRouter.get("/get-all-match", GetAllMatches);
SportRouter.patch("/toggle-match-status/:match_id", ToggleMatchStatus);



module.exports = { SportRouter };