const express=require("express")
const { GetAllPromotion, GetSinglePromotion, UpdateSinglePromotion, DeletePromotion, CreatePromotion } = require("../controllers/promotion.contoller")
const PromotionRoute=express.Router()

PromotionRoute.get("/get-all-promotion", GetAllPromotion)
PromotionRoute.get("/get-promotion/:id", GetSinglePromotion)
PromotionRoute.patch("/update-promotion/:id", UpdateSinglePromotion)
PromotionRoute.delete("/delete-promotion/:id", DeletePromotion)
PromotionRoute.post("/create-promotion", CreatePromotion)

module.exports={PromotionRoute}