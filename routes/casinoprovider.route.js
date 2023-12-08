const express = require("express");
const { GetProvider, ToggleProvider } = require("../controllers/casinoprovider.controller");


const CasinoProviderRouter = express.Router();

CasinoProviderRouter.get("/get-provider",GetProvider);
CasinoProviderRouter.patch("/toggle-provider/:id", ToggleProvider)
module.exports={CasinoProviderRouter}