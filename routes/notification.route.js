const express=require("express")
const { GetAllNotification, GetSingleNotification, CreateNotification } = require("../controllers/notification.controller")
const NotificationRoute=express.Router()


NotificationRoute.get("/get-all-notification", GetAllNotification) 

NotificationRoute.post("/get-single-notification/:id", GetSingleNotification) 

NotificationRoute.post("/create-notification", CreateNotification) 

module.exports={NotificationRoute}