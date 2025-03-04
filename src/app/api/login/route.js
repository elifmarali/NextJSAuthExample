import { getJwtSecretKey } from "@/libs/auth";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

export async function POST(req,res){
    const body= await req.json();

    // database kısmından bilgilerin doğruluğunu kontrol ederiz
    // bu örnekte database kullanamdığımız için direkt bir değer ile kontrol ediyoruz
    if(body.username==="admin" && body.password==="admin"){
        // generate a token
        const token= await new SignJWT({
            username: body.username,
            password:body.password,
            role:"admin",
        }) 
        .setProtectedHeader({alg:"HS256"})
        // hangi tarihte atıldığ bilgisini atar "iat" 
        .setIssuedAt()
        // generate edilen token'ın bir süre sonra kaldırırız
        // vercel ms'leri kullanılır
        .setExpirationTime("30s")
        .sign(getJwtSecretKey());

        console.log("token : ", token);
        
        // set a token
        const response = NextResponse.json({
            success: true
        })

        response.cookies.set({
            name:"token",
            value:token,
            path:"/"
        })

        // return the response
        return response;
    }
    return NextResponse.json({success:false})
}