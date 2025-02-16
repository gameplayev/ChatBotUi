import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/app/compomnets/libs/mongodb";
import User from "@/app/compomnets/models/user";
import { verifyToken } from "@/app/compomnets/libs/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  await connectDB();

  try {
    const decoded: any = verifyToken(req);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ message: "유저를 찾을 수 없습니다." });

    res.json(user);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
}
