const { GameSliderModel } = require("../models/gameslider.model");

const GetSlider = async (req, res) => {
  const { id } = req.params;
  try {
    const slider = await GameSliderModel.findOne({ _id: id });
    return res.status(200).json({
      status: 200,
      success: true,
      data: slider.images,
      message: "Slider retrived succesfully.",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const AddSlider = async (req, res) => {
  const { image } = req.body;
  const { id } = req.params;
  try {
    const slider = await GameSliderModel.findOneAndUpdate(
      { _id: id },
      { $push: { images: image } },
      { new: true }
    );

    return res.status(200).json({
      status: 200,
      success: true,
      data: slider.images,
      message: "Slider added Succesfully.",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const DeleteSlider = async (req, res) => {
  const { id } = req.params;
  try {
    await GameSliderModel.deleteOne({_id:id})
    return res.status(200).json({
      status: 200,
      success: true,
      data: data.data,
      message: "Slider delete Succesfully.",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const UpdateSlider = async (req, res) => {
    const { id } = req.params;
    const {images}=req.body;
    try {
      const slider=await GameSliderModel.updateOne({_id:id},{images:images}, {new:true})
      return res.status(200).json({
        status: 200,
        success: true,
        data: slider.images,
        message: "Slider update Succesfully.",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: error.message,
      });
    }
  };

module.exports={GetSlider, UpdateSlider, AddSlider, DeleteSlider}