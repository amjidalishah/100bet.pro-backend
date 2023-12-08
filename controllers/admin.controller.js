const { ControlModel } = require("../models/admincontrol.model");
const User = require("../models/user.model");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const GetAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", user_category } = req.query;
    const skip = (page - 1) * limit;
    let users = [];
    let query = {};

    if (search) {
      query = {
        $or: [
          { first_name: { $regex: search, $options: "i" } },
          { last_name: { $regex: search, $options: "i" } },
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    if (user_category == "total_user") {
      users = await User.find(query).skip(skip).limit(parseInt(limit));
    } else if (user_category == "blocked_user") {
      query.is_blocked = true;
      users = await User.find(query).skip(skip).limit(parseInt(limit));
    } else if (user_category == "email_verified") {
      query.email_verified = true;
      users = await User.find(query).skip(skip).limit(parseInt(limit));
    } else if (user_category == "total_verified") {
      query = {
        $or: [
          { email_verified: true },
          { sms_verified: true },
          { kyc_verified: true },
        ],
      };
      users = await User.find(query).skip(skip).limit(parseInt(limit));
    } else if (user_category == "with_balance") {
      query.amount = { $gt: 0 };
      users = await User.find(query).skip(skip).limit(parseInt(limit));
    } else if (user_category == "email_unverified") {
      query.email_verified = false;
      users = await User.find(query).skip(skip).limit(parseInt(limit));
    } else if (user_category == "sms_unverified") {
      query.sms_verified = false;
      users = await User.find(query).skip(skip).limit(parseInt(limit));
    } else if (user_category == "active_user") {
      query.status = true;
      users = await User.find(query).skip(skip).limit(parseInt(limit));
    }
    const totalPages = Math.ceil(users.length / limit);

    // count all document.

    const allUsers = await User.countDocuments();
    const totalVerifiedUsers = await User.countDocuments({
      $or: [
        { email_verified: true },
        { sms_verified: true },
        { kyc_verified: true },
      ],
    });

    function sortByPlacedAt(arr) {
      // Sort the array of objects by the 'placed_at' field
      let ans = arr.sort((a, b) => {
        const dateA = new Date(a.joined_at).getTime(); // Convert dates to timestamps
        const dateB = new Date(b.joined_at).getTime();
        return dateB - dateA; // Sort based on timestamps
      });
      return ans;
    }
    users = sortByPlacedAt(users);
    const bannedUsers = await User.countDocuments({ is_blocked: true });

    const activeUsers = await User.countDocuments({ status: true });

    const totalEmailVerifiedUsers = await User.countDocuments({
      email_verified: true,
    });

    const withBalanceUsers = await User.countDocuments({
      amount: { $gt: 0 },
    });

    const totalSmsUnverifiedUsers = await User.countDocuments({
      sms_verified: true,
    });

    const pagination = {
      totalUsers: users.length,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };

    res.status(200).json({
      status: 200,
      success: true,
      data: users,
      usersCount: {
        totalVerifiedUsers,
        bannedUsers,
        activeUsers,
        totalEmailVerifiedUsers,
        withBalanceUsers,
        totalSmsUnverifiedUsers,
        totalUsers: allUsers,
      },
      pagination,
      message: "User retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error,
    });
  }
};

const ToggleUserStatus = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { name } = req.body;
    // Find the market document by ID
    const user = await User.findOne({ user_id });

    user[name] = user[name] == true ? false : true;

    await user.save();

    res.status(200).json({
      status: 200,
      success: true,
      message: "Status toggled successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetSingleUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Find the market document by ID
    const user = await User.findOne({ user_id });

    res.status(200).json({
      status: 200,
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const UpdateSingleUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Find the market document by ID

    const payload = req.body;
    const user = await User.findOneAndUpdate({ user_id }, payload, {
      new: true,
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: "User details update successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const ToggleControlStatus = async (req, res) => {
  try {
    const { control_id } = req.params;
    const { name } = req.body;
    // Find the market document by ID
    const control = await ControlModel.findOne({ control_id });

    control[name] = control[name] == true ? false : true;

    await control.save();

    res.status(200).json({
      status: 200,
      success: true,
      message: "Status toggled successfully",
      data: control,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAdminControl = async (req, res) => {
  try {
    const { control_id } = req.params;

    // Find the market document by ID
    const control = await ControlModel.findOne({ control_id });

    res.status(200).json({
      status: 200,
      success: true,
      message: "Control retrieved successfully",
      data: control || {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const { VerifyJwt } = require("../utils/VerifyJwt");
const { AdminModel } = require("../models/admin.model");
const { EncryptPassword } = require("../utils/EncryptPassword");
const { DecryptPassword } = require("../utils/DecryptPassword");
const { sendEmail } = require("../utils/nodemailer");
const Admin = require("../models/admin.model");
const { GenrateJwtToken } = require("../utils/GenerateJwt");
const { GetCurrentTime } = require("../utils/GetCurrentTime");
const { default: axios } = require("axios");
const WithdrawModel = require("../models/withdraw.model");
const NotificationModel = require("../models/notification.model");

const AdminPasswordReset = async (req, res) => {
  const { admin_id } = req.params;

  try {
    const { old_password, new_password } = req.body;
    let admin = await Admin.findOne({ admin_id });
    // Compare the provided password with the hashed password in the database

    const decryptPassword = await DecryptPassword(old_password, admin.password);

    if (!decryptPassword) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Old password is incorrect.",
      });
    }
    const hashedPassword = await EncryptPassword(new_password);

    if (!admin) {
      return res.status(401).json({
        status: 404,
        success: false,
        message: "Admin not found.",
      });
    }
    admin.password = hashedPassword;
    await admin.save();
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error during password update:", error);
    res.status(500).json({
      status: 500,
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const UpdateSingleAdmin = async (req, res) => {
  try {
    const { admin_id } = req.params;
    // Find the market document by ID
    const payload = req.body;
    const admin = await Admin.findOneAndUpdate({ admin_id }, payload);
    if (!admin) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Admin not found plese try again.",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Admin details update successfully",
      data: admin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const SubstractBalanceUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { amount } = req.body;
    const user = await User.findOne({ user_id });

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found.",
        data: null,
      });
    }

    // let payload = {
    //   ...req.body,
    //   initiated_at: GetCurrentTime(),
    //   transaction_id: uuidv4(),
    // };
    // const withdraw = new WithdrawModel(payload);

    // // Save the document to the database
    // const withdrawData = await withdraw.save();

    // Assuming there is a field named 'balance' in the User model
    if (user.amount >= parseFloat(amount)) {
      user.amount -= parseFloat(amount);
      await user.save();

      res.status(200).json({
        status: 200,
        success: true,
        message: `Amount ${amount} subtracted from user's balance successfully.`,
        data: user,
      });
    } else {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Insufficient balance.",
        data: null,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const AddBalanceUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { amount } = req.body;
    const user = await User.findOne({ user_id });

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found.",
        data: null,
      });
    }

    // let payload = {
    //   ...req.body,
    //   initiated_at: GetCurrentTime(),
    //   transaction_id: uuidv4(),
    // };
    // const withdraw = new WithdrawModel(payload);

    // // Save the document to the database
    // const withdrawData = await withdraw.save();

    // Assuming there is a field named 'balance' in the User model
    user.amount += parseFloat(amount);
    await user.save();

    res.status(200).json({
      status: 200,
      success: true,
      message: `Amount ${amount} added to user's balance successfully.`,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const SendMailUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { subject, message } = req.body;
    const user = await User.findOne({ user_id });

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found.",
        data: admin,
      });
    }
    // Find the market document by ID

    sendEmail(
      [user.email],
      user.username,
      message,
      "suvamswagatamp@gmail.com",
      subject
    );
    res.status(200).json({
      status: 200,
      success: true,
      message: "Email send successfully.",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

async function AdminLogin(req, res) {
  const { email, password } = req.body; // Assuming you send username and password in the request body
  try {
    // Find the admin by username
    const admin = await Admin.findOne({ email });
    if (!admin) {
      // Password is incorrect
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Admin not found",
      });
    }
    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await DecryptPassword(password, admin.password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      // Password is incorrect
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid password",
      });
    }
    const token = GenrateJwtToken(admin.email); // You need to implement this function
    // Send a success response with the token and user data
    res.status(200).json({
      status: 200,
      success: true,
      token: token,
      redirect: "/admin/dashboard",
      message: "Login successfully",
      data: admin,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      status: 500,
      success: false,
      data: null,
      message: error.message,
    });
  }
}

async function GetAdmin(req, res) {
  const { admin_id } = req.params;
  try {
    const admin = await Admin.findOne({ admin_id: admin_id });
    res.status(200).json({
      status: 200,
      success: true,
      data: admin,
      message: "Admin retrieved successfully",
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      status: 500,
      success: false,
      data: null,
      message: error.message,
    });
  }
}

async function UserLogin(req, res) {
  const { phone, email, first_name, last_name, otpless_token } = req.body;

  try {
    // Find the admin by username
    let user = await User.findOne({ email: email });

    let username = email.split("@")[0];

    console.log(user);
    if (user) {
      let token = GenrateJwtToken(user.email); // You need to implement this function
      // Send a success response with the token and user data
      return res.status(200).json({
        status: 200,
        success: true,
        user,
        data: { token, username: user.username, otpless_token },
        redirect: "/sports",
        message: "Login successfully",
      });
    } else if (!user) {
      let payload = {
        first_name,
        last_name,
        username: username,
        user_id: uuidv4(),
        email: email,
        phone: phone,
        referral_code: username,
        joined_at: GetCurrentTime(),
        updated_at: GetCurrentTime(),
        last_seen: GetCurrentTime(),
      };
      let casinoPlayer = {
        Username: username,
        UserGroup: "a",
        Agent: "suvampandar",
        CompanyKey: process.env.COMPANY_KEY,
        ServerId: "568Win-TEST11",
      };
      let data = await axios.post(
        "https://ex-api-demo-yy.568win.com/web-root/restricted/player/register-player.aspx",
        casinoPlayer
      );

      if (!data) {
        return res.status(500).json({
          status: 500,
          success: false,
          data: null,
          message: "Player not resister, Please try again.",
        });
      }
      let user = new User(payload);
      await user.save();
      let notificationData = {
        user_id: user.user_id,
        admin_id: "admin1",
        full_name: first_name + last_name,
        username: user.username,
        email: user.email,
        amount: 0,
        description: "New user joined.",
        type: "admin",
        title: "New user",
        timestamp: GetCurrentTime(),
        category: "newuser",
      };
      let timestamp = GetCurrentTime();
      payload = { ...notificationData, timestamp };
      let notification = new NotificationModel(payload);
      await notification.save();
      let token = GenrateJwtToken(email); // You need to implement this function
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Register succesfully",
        user,
        data: { token, username, otpless_token },
        redirect: "/sports",
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      status: 500,
      success: false,
      data: null,
      message: error.message,
    });
  }
}

const GetTodayWithdrawAmount = async (req, res) => {
  try {
    const { user_id } = req.params;

    // const todayWithdraw = await WithdrawModel.find({ user_id: user_id, status:"approved" });

    const results = await WithdrawModel.find({
      user_id: user_id,
      status: "approved",
    });

    // Filter the results based on the initiated_at field within your application
    const filteredResults = results.filter((item) => {
      // Assuming initiated_at is a string in the format "YYYY-MM-DD hh:mm A/PM"
      const currentDate = new Date();
      const itemDate = new Date(item.initiated_at); // Convert the string to a Date object

      // Compare the dates (you might need to handle timezone differences)
      return (
        itemDate.getFullYear() === currentDate.getFullYear() &&
        itemDate.getMonth() === currentDate.getMonth() &&
        itemDate.getDate() === currentDate.getDate()
      );
    });

    let withdrawAmount = 0;
    for (let d = 0; d < filteredResults.length; d++) {
      withdrawAmount += filteredResults[d].withdraw_amount;
    }

    res.status(200).json({
      status: 200,
      success: false,
      amount: withdrawAmount,
      message: "Withdraw amount retrieved succesfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      data: null,
      message: error.message,
    });
  }
};

module.exports = {
  GetAllUsers,
  ToggleUserStatus,
  GetSingleUser,
  UpdateSingleUser,
  ToggleControlStatus,
  GetAdminControl,
  AdminPasswordReset,
  UpdateSingleAdmin,
  SubstractBalanceUser,
  AddBalanceUser,
  SendMailUser,
  AdminLogin,
  GetAdmin,
  UserLogin,
  GetTodayWithdrawAmount,
};
