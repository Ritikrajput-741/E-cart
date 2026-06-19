import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../Model/auth_Schema.js";
import { Session } from "../Model/session_Schema.js";
import { verifyEmail } from "../VerifyEmail/email_verify.js";
import { sendOtpMail } from "../VerifyEmail/otp_mail.js";
import cloudinary from "../utils/cloudinary.js";

/* Api for register user */
export const userRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields Required",
      });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Exist",
      });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashPass,
    });

    const token = await jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });

    await verifyEmail(token, email);

    newUser.token = token;
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User create Successfully✅",

      newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal Server error ${error.message}`,
    });
  }
};

/*  Api for verify token  */
export const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: `Token is missing or Invalid`,
      });
    }

    const token = await authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = await jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: `Token is Expired, Plz Created new One`,
        });
      }
      return res.status(400).json({
        success: false,
        message: `Token Verification failed ❌`,
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: `User not found`,
      });
    }

    ((user.isVerified = true), (user.token = null));
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Token Verification Successfully✅",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal Server error ${error.message}`,
    });
  }
};

/*  Api for login user */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: `All Fields Required`,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: `User not found`,
      });
    }

    const matchPass = await bcrypt.compare(password, user.password);
    if (!matchPass) {
      return res.status(400).json({
        success: false,
        message: `Incorrect password`,
      });
    }

    if (user.isVerified !== true) {
      return res.status(401).json({
        success: false,
        message: `Unauthorized to access, plz verified your account`,
      });
    }

    //check, is session exist than delete that otherwise create
    let existSession = await Session.findOne({ userId: user._id });
    if (existSession) {
      await Session.deleteOne({ userId: user._id });
    }
    await Session.create({ userId: user._id });

    // generated tokens

    const accessToken = await jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "10d" },
    );
    const refreshToken = await jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "10d" },
    );

    user.isLoggedIn = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.firstName}`,
      accessToken,
      refreshToken,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal Server error ${error.message}`,
    });
  }
};

/*  Api for logout user */
export const logOutUser = async (req, res) => {
  try {
    const userId = req.userId;

    await Session.deleteMany({ userId });
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });

    return res.status(200).json({
      success: true,
      message: " Logout Successfully✅",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal Server error ${error.message}`,
    });
  }
};

/*  Api for forget password */
export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(500).json({
        success: false,
        message: `Email required`,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(500).json({
        success: false,
        message: `user not found`,
      });
    }

    const otp = await Math.floor(100000 + Math.random() * 100000).toString();
    const otpExpiry = await new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await sendOtpMail(email, otp);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Otp sent Successfully✅",
      otp,
      otpExpiry,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal Server error ${error.message}`,
    });
  }
};

/*  Api for verify otp */
export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.params.email;
    if (!otp) {
      return res.status(401).json({
        success: false,
        message: "Otp required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(401).json({
        success: false,
        message: "Otp not generated or already verified",
      });
    }

    if (user.otp !== otp) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Otp",
      });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(401).json({
        success: false,
        message: "Otp Expired",
      });
    }

    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Otp verified Successfully✅",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal Server error ${error.message}`,
    });
  }
};

/* Api for confirm password */

export const confirmPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const email = req.params.email;

    if (!newPassword || !confirmPassword) {
      return res.status(401).json({
        success: false,
        message: `All fields required`,
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: `Password don't match`,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found`,
      });
    }

    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashNewPassword;

    user.isLoggedIn = false;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password Forget Successfully✅",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal Server error ${error.message}`,
    });
  }
};

/* Api for get all user */

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find();

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All users fetched successfully ✅",
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* Api for get user by id */

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully ✅",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/*  Api for update user */
export const updateUser = async (req, res) => {
  try {
    const userIdToUpdated = req.params.id;
    const loggedUser = req.user;
    const { firstName, lastName, address, city, zipcode, phoneNo, role } =
      req.body;

    if (
      loggedUser._id.toString() !== userIdToUpdated &&
      loggedUser.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update",
      });
    }

    const user = await User.findById(userIdToUpdated);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let profilePicUrl = user.profilePic;
    let profilePicPublicId = user.profilePicPublicId;

    // if new file is upload
    if (req.file) {
      // destroy if already exist
      if (profilePicPublicId) {
        await cloudinary.uploader.destroy(profilePicPublicId);
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profiles" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(req.file.buffer);
      });
      profilePicUrl = uploadResult.secure_url;
      profilePicPublicId = uploadResult.public_id;
    }

    //update fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.address = address || user.address;
    user.zipcode = zipcode || user.zipcode;
    user.city = city || user.city;
    user.phoneNo = phoneNo || user.phoneNo;
    user.role = role || user.role;
    user.profilePic = profilePicUrl;
    user.profilePicPublicId = profilePicPublicId;

    const updatedUser = await user.save();
    return res.status(200).json({
      success: true,
      message: "User updated Successfully✅",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server Error",
    });
  }
};
