import { Router } from "express";
import { signin, signup } from "./user.controller.js";
const userrouter = Router();

userrouter.post("/signup", signup);
userrouter.post("/signin",signin)
export default userrouter; 