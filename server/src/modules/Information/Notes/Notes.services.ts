import pool from "../../../config/db.js";

export interface note{
    note_id:number,
    title:string,
    context:string,
    visibility:boolean,
    user_id:number,
    created_at:Date,
    updated_at:Date
}

export const createnote= async (
 title:string,
 context:string,
 visibility:boolean,
 created_at:Date
)=>
{
  const result=await pool.query(
    'INSERT into notes(title,context,visibility,created_at) VALUES[$1,$2,$3,$4]',
    [title,context,visibility,created_at]
  );
}

export const viewallnotes= async(
 user_id:number
)=>
{
  const result=await pool.query(
    'SELECT * from notes WHERE user_id=$1',
    [user_id]
  );
}

export const view1note=async (
  task_id:number,
  user_id:number
)=>
{
  const result=await pool.query(
    'SELECT * from notes WHERE user_id=$1 & task_id=$2 ',
    [user_id,task_id]
  );
}