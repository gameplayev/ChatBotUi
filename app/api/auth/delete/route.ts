import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/compomnets/libs/mongodb";
import { verifyAccessToken } from "@/app/compomnets/libs/auth";
import User from "@/app/compomnets/models/user";
import { JwtPayload } from "jsonwebtoken";

interface decodedJwt extends JwtPayload {
    id: string;
}


export async function DELETE(req:NextRequest) {
    try{
        await connectDB();

        const decoded = verifyAccessToken(req) as decodedJwt;
        if(!decoded){ return NextResponse.json({message:"failed to find User"},{status:404});}
        const userID = decoded.id;
        
        const res = await User.findByIdAndDelete(userID);
        if(!res) { return NextResponse.json({message:"failed to Delete User"},{status:401});}
        
        return NextResponse.json({message:"user has been deleted!"},{status:200});
    }catch(error:any){
        NextResponse.json({message:error.message},{status:500});
    }
}
