import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/compomnets/libs/mongodb";
import User from "@/app/compomnets/models/user";
import { verifyAccessToken } from "@/app/compomnets/libs/auth";
import { JwtPayload } from "jsonwebtoken";

interface decodedJwt extends JwtPayload {
    id: string;
}

export async function GET(req: NextRequest) {
  if (req.method !== "GET") return NextResponse.json({message:"Method not allowed"},{status:405});
  await connectDB();

  try {
    const decoded = verifyAccessToken(req) as decodedJwt;
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return NextResponse.json({message:"유저를 찾을 수 없습니다."},{status:404});
      
    return NextResponse.json({user:user},{status:200});
  }catch(error: unknown){
    if (error instanceof Error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
    return NextResponse.json({message: "An unknown error occurred"}, {status: 500});
}
}
