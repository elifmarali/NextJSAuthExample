import React from "react";
import { verifyJwtToken } from "@/libs/auth";
import Cookies from "universal-cookie";

// server side tarafında kullancağımız kısım
const fromServer = async () => {
  const cookies = require("next/headers").cookies;
  const cookieList = cookies();
  const { value: token } = cookieList.get("token" ?? { value: null });

  const verifiedToken = await verifyJwtToken(token);

  return verifiedToken;
};

// client side tarafında kullancağımız kısım
export function useAuth() {
    const [auth,setAuth] = React.useState(null);

    const getVerifiedToken= async()=>{
        const cookies = new Cookies();
        const token = cookies.get("token") ?? null;
        const verifiedToken = await verifyJwtToken(token);
        setAuth(verifiedToken);
    }

    React.useEffect(()=>{
        getVerifiedToken();
    },[]);
    
    return auth;
}

// server side tarafında kullanmak için
/* 
    useAuth.fromServer()
*/

useAuth.fromServer = fromServer;
