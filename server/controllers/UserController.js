import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";

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

export { registerUser };
