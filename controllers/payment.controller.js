const { VerifyJwt } = require("../utils/VerifyJwt");
const { PaymentModel } = require("../models/payment.model");
const { imageLink } = require("../utils/imgupload");

const Get_all_payment_method = async (req, res) => {
  const { type } = req.query;
  try {
    const methods = await PaymentModel.find({ type });

    if (!methods || methods.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        data: [],
        message: "No payment methods found",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      data: methods,
      message: "Payment methods retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    // Handle any errors that occur during the database query
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error while getting payment methods",
    });
  }
};

const Add_Payment_method = async (req, res) => {
  console.log("Adding payment method initiated", req.body);
  try {
    // const token = req.headers.authorization;
    // const { email } = await VerifyJwt(token);

    // if (!email || email !== 'johndoe@example.com') {
    //   return res.status(401).send({
    //     status: false,
    //     message: 'Not authorized',
    //   });
    // }

    const {
      gateway,
      currency,
      processing_time,
      image,
      max_limit,
      min_limit,
      instruction,
      admin_details,
      user_details,
      type,
      bonus
    } = req.body;

    if (
      !gateway ||
      !currency ||
      !processing_time ||
      !image ||
      !max_limit ||
      !min_limit ||
      !instruction ||
      !admin_details ||
      !user_details ||
      !type 
    ) {
      return res.status(400).send({
        status: 400,
        success: false,
        message: "Request body cannot be empty",
      });
    }

    const newGateWay = new PaymentModel({
      gateway,
      currency,
      processing_time,
      image,
      max_limit,
      min_limit,
      instruction,
      admin_details,
      user_details,
      type, bonus
    });
    await newGateWay.save();
    return res.status(201).json({
      status: 201,
      success: true,
      data: newGateWay,
      message: "Payment method added successfully",
    });
  } catch (error) {
    console.error(error, "Internal server error in add_payment Method");
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const get_image_link = async (req, res) => {
  try {
    const post_img = await imageLink(req, res);
    return res.status(200).json({
      status: 200,
      success: true,
      url: post_img,
      message: "Image url generate succesfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Error while creating image url",
    });
  }
};

const Update_payment_method = async (req, res) => {
  try {
    const id = req.params._id;
    const payload = req.body;

    const existingMethod = await PaymentModel.findByIdAndUpdate(
      { _id: id },
      payload
    );

    if (!existingMethod) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Payment method not found",
      });
    }

    // Send a success response
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Payment method updated successfully",
      data: existingMethod,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error while updating payment method",
    });
  }
};

const Update_payment_method_status = async (req, res) => {
  try {
    const id = req.params._id;
    const existingDocument = await PaymentModel.findById(id);
    const updatedStatus = !existingDocument.status;
    const updatedDocument = await PaymentModel.findByIdAndUpdate(
      { _id: id },
      { status: updatedStatus },
      { new: true }
    );
    // Save the updated payment method to the database
    // Send a success response
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Payment method updated successfully",
      data: updatedDocument,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error while updating payment method",
    });
  }
};

const Delete_payment_method = async (req, res) => {
  try {
    const { _id } = req.params;

    const paymentMethod = await PaymentModel.deleteOne({ _id });

    if (!paymentMethod) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Payment method not found",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Payment method delete successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const add_user_deposit_details = async (req, res) => {
  try {
    const { name, type, placeholder } = req.body;

    const obj = {
      id: new Date().getTime(),
      name,
      type,
      placeholder,
    };

    const user_deposit_model = new PaymentModel({});
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "internal server error while adding feild in user-side",
    });
  }
};

module.exports = {
  Add_Payment_method,
  Get_all_payment_method,
  Update_payment_method,
  Delete_payment_method,
  get_image_link,
  Update_payment_method_status,
};
