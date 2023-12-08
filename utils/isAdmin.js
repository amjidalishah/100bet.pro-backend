const { model } = require("mongoose");
const { VerifyJwt } = require("./VerifyJwt");


const IsAdminMiddleware=(req,res,next)=>{

     const token=req.headers.authorization;


const decode=VerifyJwt(token)

if(!decode.email){
    return res.status(500).send({status:500,success:false,message:"not allowed operation"})
}

if(decode.admin_id===1){
    next()
}
else{
    return res.status(500).send({status:500,success:false,message:"not allowed operation"})
}


}


module.exports={
    IsAdminMiddleware
}