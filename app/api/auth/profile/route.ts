import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/compomnets/libs/mongodb";
import User from "@/app/compomnets/models/user";
import { verifyAccessToken } from "@/app/compomnets/libs/auth";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") return NextResponse.json({message:"Method not allowed"},{status:405});
  await connectDB();

  try {
    const decoded: any = verifyAccessToken(req);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return NextResponse.json({message:"유저를 찾을 수 없습니다."},{status:404});
      
    return NextResponse.json({user:user},{status:200});
  } catch (error: any) {
    return NextResponse.json({message:error.message},{status:401});
  }
}
//비번 바꾸기, 프로필 조회 기능 구현하기, 계정 삭제 만들기