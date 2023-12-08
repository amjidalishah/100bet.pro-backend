const express=require("express");
const { AddSlider, UpdateSlider, DeleteSlider, GetSlider } = require("../controllers/gameslider.controller");

const GameSliderRoute=express.Router();


GameSliderRoute.get("/get-slider/:id", GetSlider);
GameSliderRoute.post("/add-slider/:id", AddSlider);
GameSliderRoute.patch("/update-slider/:id", UpdateSlider);
GameSliderRoute.delete("/delete-slider/:id", DeleteSlider);

module.exports={GameSliderRoute}