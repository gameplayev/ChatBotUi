import jwt from "jsonwebtoken";
import { NextApiRequest } from "next";

export function verifyToken(req: NextApiRequest) {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer TOKEN"
  if (!token) throw new Error("토큰이 없습니다.");

  try {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    throw new Error("토큰이 유효하지 않습니다.");
  }
}
