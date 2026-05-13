import { Router } from "express";
import { signin, signup, googleAuth } from "./user.controller.js";
const userrouter = Router();

userrouter.post("/signup", signup);
userrouter.post("/signin", signin);
userrouter.post("/google", googleAuth);

export default userrouter;