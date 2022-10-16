import * as argon2 from "argon2"

export const hashPassword = async(password:string)=>{
    const hash = await argon2.hash(password);
    return hash
} 

export const verifyHashedPassword = async(hashedPwd:any, password:string)=>{
    if(await argon2.verify(hashedPwd, password)){
            return true;
    }else{
        return false;
    }
}