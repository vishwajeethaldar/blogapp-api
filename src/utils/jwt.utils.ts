import { config } from "../providers";
import jwt from "jsonwebtoken";

// sign jwt
export function singJwt(payload:object, expiresIn:string|number, kind:"access"|"refresh"){
   if(kind==="access"){
    let token = jwt.sign(payload, config().privateKey, {expiresIn:expiresIn})
    return token
   }else{
    let token = jwt.sign(payload, config().privateKey, {expiresIn:expiresIn})
    return token
   }
    
}


// verify jwt
export function verifyJwt(token:string, kind:"access"|"refresh"){
    try
    {   if(kind==="access")
        {
            let decoded = jwt.verify(token, config().privateKey)
            return {decoded};
        }
        if(kind==="refresh"){
            let decoded = jwt.verify(token, config().publicKey)

            return ({payload:decoded});
        }
        
       
    }catch(error:any){
        return {payload:null, expired:error.message}
    }
}


/*
jwt exp time check
if (Date.now() >= exp * 1000) {
  return false;
}
*/