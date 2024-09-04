import express from "express";
import authToken from "../middleware/authToken.js";
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser
} from "../controllers/UserController.js";
const UserRouter = express.Router();
UserRouter.post("/register", registerUser);
UserRouter.post("/login", loginUser);
UserRouter.post("/logout", logoutUser);
UserRouter.get("/getuser", authToken, getUser);
export default UserRouter;
