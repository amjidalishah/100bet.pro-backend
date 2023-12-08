const NotificationModel = require("../models/notification.model");
const { GetCurrentTime } = require("../utils/GetCurrentTime");

const GetAllNotification = async (req, res) => {
  const { type, user_id, admin_id, limit=20 } = req.query;
  // const {types}=req.body;
  let query = {};
  if (user_id) {
    query.user_id = user_id;
  }
  if(admin_id){
    query.admin_id = admin_id;
  }
  if (type) {
    query.type = type;
  }
  try {
    let notifications = await NotificationModel.find(query)
      .sort({ timestamp: -1 }).limit(limit)
      .exec();

    // let notifications;
    // if(types&&types.length==1){
    //   notifications = await NotificationModel.find({ type: { $in: types }, admin_id: id }).sort({ timestamp: -1 })
    //   .exec();;
    // }
    // else {
    //   notifications = await NotificationModel.find({ type: { $in: types }, user_id: id }).sort({ timestamp: -1 })
    //   .exec();;
    // }
    res.status(200).json({
      status: 200,
      success: true,
      data: notifications,
      message: "Notification data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,

      message: error.message,
    });
  }
};

const CreateNotification = async (req, res) => {
  let payload = req.body;
  try {
    const timestamp = GetCurrentTime();
    payload = { ...payload, timestamp };
    let notification = new NotificationModel(payload);
    await notification.save();
    res.status(200).json({
      status: 200,
      success: true,
      data: notification,

      message: "Notification added successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,

      message: error.message,
    });
  }
};

const GetSingleNotification = async (req, res) => {
  const { id } = req.params;
  try {
    let notification = await NotificationModel.findById(id);
    res.status(200).json({
      status: 200,
      success: true,
      data: notification,
      message: "Notification data retrieved successfully",
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
  GetAllNotification,
  CreateNotification,
  GetSingleNotification,
};
