import { Router } from "express";
import { createnote, viewnotes, searchnote, removeNote } from "./Notes.controller.js";

const noterouter = Router();

noterouter.post("/", createnote);
noterouter.get("/", viewnotes);
noterouter.post("/search", searchnote);
noterouter.delete("/:note_id", removeNote);

export default noterouter;
