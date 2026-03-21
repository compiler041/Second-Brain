import pool from "../../../config/db.js"

export interface YT {
    video_id: number,
    video_link: string,  
    title: string,
    description: string,
    visibility: boolean,
    user_id: number,
    saved_at: Date
}

export const add = async (
    video_link: string,
    title: string,
    description: string
) => {
    const result = await pool.query(
        'INSERT INTO youtube_videos(video_link, title, description) VALUES ($1, $2, $3) RETURNING *',
        [video_link, title, description]
    );
    return result.rows[0]; 
}

export const viewyt = async (user_id: number) => {
    const result = await pool.query(
        'SELECT * FROM youtube_videos WHERE user_id=$1',
        [user_id]
    );
    return result.rows; 
}

export const view1yt = async (title: string, user_id: number) => {
    const result = await pool.query(
        'SELECT * FROM youtube_videos WHERE user_id=$1 AND title=$2', 
        [user_id, title]
    );
    return result.rows[0]; 
}