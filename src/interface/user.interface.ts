export interface Iuser{
    name:string,
    email:string,
    password:string,
    otp:string;
    role?:"admin"|"user"
}

