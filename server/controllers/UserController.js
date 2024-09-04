import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function registerUser(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Not all credentials are provided!", success: false });
  }
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already present, login now", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword
    });
    const response = await newUser.save();
    response.password = "";
    return res.status(201).json({
      message: "User created successfully",
      success: true,
      user: response
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error while registering user", success: false });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Not all credentials are provided!", success: false });
  }
  try {
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "User doesn't exist", success: false });
    }
    const isPassword = await bcrypt.compare(password, existingUser.password);
    if (!isPassword) {
      return res
        .status(401)
        .json({ message: "Incorrect password", success: false });
    }

    const token = jwt.sign(
      {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("mywatchlist-token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "None"
    });

    existingUser.password = "";

    return res.status(200).json({
      message: "Login successfull",
      success: true,
      user: existingUser
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error while loggin user", success: false });
  }
}

export { registerUser, loginUser };
