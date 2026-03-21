import { Router } from "express";
import { getalltasks, getOneTask, todo_create } from "./tasks.controller.js";
const taskrouter=Router();

taskrouter.post("/createtask",todo_create);
taskrouter.get("/getalltask",getalltasks);
taskrouter.get("/gettask",getOneTask);

