const express = require("express");
const {
  GetAllDepositTransaction,
  GetAllWithdrawTransaction,
  GetWithdrawByUserId,
  GetDepositByUserId,
  CreateDepositTransaction,
  CreateWithdrawTransaction,
  GetTransactionsByUserId,
  GetDepositById,
  GetWithdrawById,
  UpdateDepositById,
  UpdateWithdrawById,
} = require("../controllers/transaction.controller");

const TransactionRouter = express.Router();

TransactionRouter.get("/get-all-withdraw", GetAllWithdrawTransaction);
TransactionRouter.get("/get-all-deposit", GetAllDepositTransaction);
TransactionRouter.get("/get-withdraw/:user_id", GetWithdrawByUserId);
TransactionRouter.get("/get-deposit/:user_id", GetDepositByUserId);
TransactionRouter.post("/create-withdraw-request/:user_id", CreateWithdrawTransaction);
TransactionRouter.post("/create-deposit-request/:user_id", CreateDepositTransaction);
TransactionRouter.get("/get-all-transaction/:user_id", GetTransactionsByUserId);
TransactionRouter.get("/get-single-deposit/:_id", GetDepositById);
TransactionRouter.get("/get-single-withdraw/:_id", GetWithdrawById);
TransactionRouter.patch("/update-single-deposit/:_id", UpdateDepositById);
TransactionRouter.patch("/update-single-withdraw/:_id", UpdateWithdrawById);

module.exports = { TransactionRouter };
