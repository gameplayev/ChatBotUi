import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
export function generateAccessToken(payload: object){
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "1h" });
}

export function verifyAccessToken(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  
  if (!token) {
    throw new Error("You have no token");
  }

  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (error: any) {
    throw new Error(error.message);
  }
}
