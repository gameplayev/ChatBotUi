import { connectDB } from "@/app/compomnets/libs/mongodb";
import User from "@/app/compomnets/models/user";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "@/app/compomnets/libs/auth";
import { NextResponse } from "next/server";


export async function POST(req: Request) {

  if (req.method !== "POST") return NextResponse.json({message: "Method not allowed"},{status:405});

  await connectDB();
  const body = await req.json();
  const {email,password} = body;
  
  console.log(email,password);
  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({message: "이메일 또는 비밀번호가 올바르지 않습니다."},{status:401});

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return NextResponse.json({message: "이메일 또는 비밀번호가 올바르지 않습니다."},{status:401});

  const accessToken = generateAccessToken({id: user._id, email: user.email}) ;
  await user.save();

  return NextResponse.json({accessToken},{status:201});
}
