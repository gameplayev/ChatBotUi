import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/compomnets/libs/mongodb";
import User from "@/app/compomnets/models/user";
import { verifyAccessToken } from "@/app/compomnets/libs/auth";

export async function PATCH(req:NextRequest) {
    await connectDB();

    try{
        const decoded:any = verifyAccessToken(req);
        const user = await User.findById(decoded.id).select("-password");
        if(!user) return NextResponse.json({message:"failed to find User"},{status:500});

        user.chatNumber += 1;
        await user.save();
        
        return NextResponse.json({Message:"채팅 기록 수정 완료"},{status:200});
    }catch(error:any){
        return NextResponse.json({message:error.message},{status:500});
    }
}

