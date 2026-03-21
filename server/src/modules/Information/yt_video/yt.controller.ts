import type { Request, Response } from "express" 
import { add, view1yt, viewyt } from "./yt.services.js";

export const createyt = async (req: Request, res: Response) => {
    const { video_link, title, description } = req.body;
    if (!video_link) {
        res.json({ message: "Pls add the link" });
        return; 
    }
    const result = await add(video_link, title, description);
    res.json(result); 
}

export const viewall = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    if (!user_id) {
        res.json({ message: "Pls Login" });
        return; 
    }
    const result = await viewyt(Number(user_id)); 
    res.json(result); 
}

export const search1 = async (req: Request, res: Response) => {
    const { title } = req.body;
    const { user_id } = req.params;
    const result = await view1yt(title, Number(user_id)); 
    res.json(result); 
}