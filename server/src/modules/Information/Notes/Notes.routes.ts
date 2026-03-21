import { Router } from "express";
import { createnote } from "./Notes.controller.js";
import { searchnote, viewnotes } from "./Notes.controller.js";
const noterouter=Router();

noterouter.post("/createnote",createnote);
noterouter.post("/viewnotes",viewnotes);
noterouter.post("/createnote",searchnote);

