import { Router } from "express";
import { getalltasks, getOneTask, todo_create, updateTask, deleteTask } from "./tasks.controller.js";

const taskrouter = Router();

taskrouter.post("/", todo_create);
taskrouter.get("/", getalltasks);
taskrouter.get("/:task_id", getOneTask);
taskrouter.put("/:task_id", updateTask);
taskrouter.delete("/:task_id", deleteTask);

export default taskrouter;
