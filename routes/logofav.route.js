const express = require("express");
const { UpdateLogoFav, GetLogoFav } = require("../controllers/logofav.controller");



const LogoFavRouter = express.Router();
LogoFavRouter.get("/get-logo-fav/:id", GetLogoFav);
LogoFavRouter.patch("/update-logo-fav/:id", UpdateLogoFav);




module.exports = { LogoFavRouter };