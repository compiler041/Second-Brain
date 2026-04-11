import { Router } from "express";
import { createyt, viewall, search1, removeVideo } from "./yt.controller.js";

const ytrouter = Router();

ytrouter.post("/", createyt);
ytrouter.get("/", viewall);
ytrouter.post("/search", search1);
ytrouter.delete("/:video_id", removeVideo);

export default ytrouter;