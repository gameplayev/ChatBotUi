import { connectDB } from "@/app/compomnets/libs/mongodb";
import User from "@/app/compomnets/models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  if (req.method !== "POST") return NextResponse.json({message: "Method not allowed"},{status:405});

  await connectDB();
  const { email, password } = await req.json();
  console.log(password);

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({message: "이미 가입된 이메일 입니다."}, {status:400});
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword,chatNumber: 0});

  await newUser.save();

  return NextResponse.json({message: "회원가입이 성공적으로 완료되었습니다."},{status:201});
}
