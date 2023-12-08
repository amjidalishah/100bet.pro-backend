const PromotionModel = require("../models/promotion.model");
const { GetCurrentTime } = require("../utils/GetCurrentTime");

const GetAllPromotion = async (req, res) => {
  //   const { type } = req.params;
  const { type } = req.query;
  try {
    let promotions = [];

    if (type == "all") {
      promotions = await PromotionModel.find();
    } else {
      promotions = await PromotionModel.find({ type });
    }
    res.status(200).json({
      status: 200,
      success: true,
      data: promotions,
      message: "Promotion data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,

      message: error.message,
    });
  }
};

const CreatePromotion = async (req, res) => {
  let payload = req.body;
  try {
    const timestamp = GetCurrentTime();
    payload = { ...payload, timestamp };
    let promotion = new PromotionModel(payload);
    await promotion.save();
    res.status(200).json({
      status: 200,
      success: true,
      data: promotion,
      message: "Promotion added successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,

      message: error.message,
    });
  }
};

const GetSinglePromotion = async (req, res) => {
  const { id } = req.params;
  try {
    let promotion = await PromotionModel.findById(id);
    res.status(200).json({
      status: 200,
      success: true,
      data: promotion,
      message: "Promotion data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const UpdateSinglePromotion = async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  try {
    let promotion = await PromotionModel.findOneAndUpdate({ _id: id }, payload, {
      new: true,
    });
    res.status(200).json({
      status: 200,
      success: true,
      data: promotion,
      message: "Promotion data update successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const DeletePromotion = async (req, res) => {
  const { id } = req.params;
  try {
    await PromotionModel.deleteOne({ _id: id });
    res.status(200).json({
      status: 200,
      success: true,
      message: "Promotion delete successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  GetAllPromotion,
  DeletePromotion,
  CreatePromotion,
  GetSinglePromotion,
  UpdateSinglePromotion,
};
