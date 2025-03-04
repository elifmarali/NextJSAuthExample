// jose paketi : token'ı kontrol eder verified bir token mı diye
// jose paketi : kullanıcı login olduğunda bir token döner 
// middleware desteklerse jsonwebtoken paketi kullanılabilir. next 13 versiyonu middlewaredeki edge desteklenmediğinden kullanmadık

import { jwtVerify } from "jose";

export const getJwtSecretKey = ()=>{
    const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;

    if(!secretKey){
        // Proje canlıya çıktığında secret key koymadığımız durumda hatayı daha çabuk yakalayabilmek için
        // ayrı bir fonksiyonla secretKey değerini getiriyoruz
        throw new Error("JWT secret key is not available")
    }

    return new TextEncoder().encode(secretKey);
}

export async function verifyJwtToken (token){
    try{
        // içerisine 2 parametre alır
        // 1. parametre : token
        // 2. parametre : signature(imza). opsiyoneldir
        // signature için uuid ile generate edilmiş bir ifade tanımladım -> https://www.uuidgenerator.net/ 
       const {payload} = await jwtVerify(token, getJwtSecretKey());
       return payload;
    }catch(err){
        return null;
    }
}