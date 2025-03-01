import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/compomnets/libs/mongodb";
import User from "@/app/compomnets/models/user";
import { verifyAccessToken } from "@/app/compomnets/libs/auth";
import {  JwtPayload } from "jsonwebtoken";

interface decodedJwt extends JwtPayload {
    id: string;
}

export async function PATCH(req:NextRequest) {
    await connectDB();

    try{
        const decoded = verifyAccessToken(req) as decodedJwt;
        const user = await User.findById(decoded.id).select("-password");
        if(!user) return NextResponse.json({message:"failed to find User"},{status:500});

        user.chatNumber += 1;
        await user.save();
        
        return NextResponse.json({Message:"채팅 기록 수정 완료"},{status:200});
    }catch(error: unknown){
        if (error instanceof Error) {
            return NextResponse.json({message: error.message}, {status: 500});
        }
        return NextResponse.json({message: "An unknown error occurred"}, {status: 500});
    }
}

