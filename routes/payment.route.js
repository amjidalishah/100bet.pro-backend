const express=require('express');
const { Add_Payment_method, Get_all_payment_method, Update_payment_method, Delete_payment_method, get_image_link, Update_payment_method_status } = require('../controllers/payment.controller');
const { IsAdminMiddleware } = require('../utils/isAdmin');
const { upload } = require('../middleware/multer');


const PaymentRoute=express.Router();

//PaymentRoute.use(IsAdminMiddleware)

PaymentRoute.get('/get-payment-method',Get_all_payment_method)
PaymentRoute.patch('/update-payment-method/:_id',Update_payment_method)
PaymentRoute.use(express.urlencoded({extended:false}))
PaymentRoute.post("/add-method",Add_Payment_method)
PaymentRoute.post("/image-url",upload.single('post_img'),get_image_link)
PaymentRoute.delete('/delete-payment-method/:_id',Delete_payment_method)
PaymentRoute.patch('/update_payment_method_status/:_id',Update_payment_method_status)


module.exports={PaymentRoute}