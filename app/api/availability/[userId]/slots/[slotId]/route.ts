import { adminDb } from "@/lib/firebaseAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { deleteDoc, doc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req:NextRequest,{params}:{params:{slotId:string}}){


  try{
    const {userId} = getAuth(req);

    if(!userId){
      return NextResponse.json({error:"not authorized"},{status:401})
    }

    const {slotId} = params;
    const slotRef = adminDb
      .collection("availability")
      .doc(userId)
      .collection("slots")
      .doc(slotId);

     await slotRef.delete();

    return NextResponse.json({success:true},{status:200})

  }catch(error){
    console.error("couldnt delete the time slot");
    return NextResponse.json({error:"failed to delete"},{status:500})

  }
}