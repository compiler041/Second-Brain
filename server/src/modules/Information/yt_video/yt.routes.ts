import { Router } from "express";
import { createyt, search1, viewall } from "./yt.controller.js";
const ytrouter=Router();
ytrouter.post("/addyt", createyt);
ytrouter.get("viewallyt",viewall);
ytrouter.get("/viewone",search1);