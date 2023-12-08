const express = require("express");
const {
  GetAllUsers,
  ToggleUserStatus,
  UpdateSingleUser,
  GetSingleUser,
  ToggleControlStatus,
  GetAdminControl,
  AdminPasswordReset,
  AddBalanceUser,
  SubstractBalanceUser,
  SendMailUser,
  AdminLogin,
  GetAdmin, 
  UpdateSingleAdmin,
  UserLogin,
  GetTodayWithdrawAmount
} = require("../controllers/admin.controller");

const AdminRouter = express.Router();
AdminRouter.get("/get-all-user", GetAllUsers);
AdminRouter.patch("/toggle-user-status/:user_id", ToggleUserStatus);
AdminRouter.get("/get-single-user/:user_id", GetSingleUser);
AdminRouter.patch("/update-single-user/:user_id", UpdateSingleUser);
AdminRouter.patch("/toggle-admin-control/:control_id", ToggleControlStatus);
AdminRouter.get("/get-admin-control/:control_id", GetAdminControl);
AdminRouter.patch("/reset-password/:admin_id", AdminPasswordReset);
AdminRouter.patch("/add-balance/:user_id", AddBalanceUser);
AdminRouter.patch("/substract-balance/:user_id", SubstractBalanceUser);
AdminRouter.post("/send-mail/:user_id", SendMailUser);
AdminRouter.post("/admin-login", AdminLogin);
AdminRouter.get("/get-admin/:admin_id", GetAdmin);
AdminRouter.patch("/update-admin/:admin_id", UpdateSingleAdmin);
AdminRouter.post("/user-login", UserLogin);
AdminRouter.get("/get-withdraw-amount/:user_id", GetTodayWithdrawAmount);

// add user , 
module.exports = { AdminRouter };
