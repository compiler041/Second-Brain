import type { Request } from "express";

export interface AuthRequest extends Request {
  user_id?: number;
  email?: string;
}
