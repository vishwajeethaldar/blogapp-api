"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = exports.verifyUserRegistration = exports.userRegister = void 0;
const models_1 = require("../models");
const providers_1 = require("../providers");
const utils_1 = require("../utils");
const argon2Utils_1 = require("../utils/argon2Utils");
/*
const userRegister = async(req:Request, res:Response)=>{
        const {name, email, password} = req.body
        const hashedPwd = await hashPassword(password)
        try{
            let user = await User.findOne({email:email})
            if(user){
                res.send("User Already Exists Please Login")
            }else{
                const newUser = await User.create({name:name, email:email, password:hashedPwd})
                res.send(newUser)
            }
            
        }
        catch(e:any){
            res.status(401).send(e.message)
        }
        

}

*/
const userRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const hashedPwd = yield (0, argon2Utils_1.hashPassword)(password);
    try {
        let user = yield models_1.User.findOne({ email: email });
        if (user) {
            res.send("User Already Exists Please Login");
        }
        else {
            let payloadData = { name: name, email: email, secret: hashedPwd };
            let token = utils_1.jwtutils.singJwt(payloadData, "2h", "access");
            yield utils_1.ZohoMail.Z_Mail_Transport.sendMail({
                to: email,
                from: (0, providers_1.config)().Z_Mail,
                subject: "Verify your Account",
                text: `Hellow \n Welcome to blog.hintuts.in, click here to verify your email`,
                html: `<div>
                <h3>Hellow <br/> Welcome to blog.hinditutts.in <br/> Please Click here to verify your email</h3>
                <a href=${(0, providers_1.config)().DEFAULTURL}/api/user/confirm?verify=${token}>Verify Email</a>
                </div>`
            });
            res.send("Verification Link Send Successfully");
        }
    }
    catch (e) {
        res.status(401).send(e.message);
    }
});
exports.userRegister = userRegister;
const verifyUserRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let token = ((_a = req.query.verify) === null || _a === void 0 ? void 0 : _a.toString()) || "";
    let { name, email, secret } = (_b = utils_1.jwtutils.verifyJwt(token, "access")) === null || _b === void 0 ? void 0 : _b.decoded;
    console.log(name, email, secret);
    if (!email) {
        return res.send("Link Expired please register again");
    }
    let exist = yield models_1.User.findOne({ email: email });
    if (exist) {
        return res.send("User Already Registered");
    }
    yield models_1.User.create({ name: name, email: email, password: secret });
    return res.redirect(`http://localhost:5173/login`);
});
exports.verifyUserRegistration = verifyUserRegistration;
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        let user = yield models_1.User.findOne({ _id: id }, { password: 0, otp: 0, __v: 0 });
        if (user) {
            res.send(user);
        }
        else {
            res.status(401).send("user Not Found");
        }
    }
    catch (e) {
        return res.status(400).send(e.message);
    }
});
exports.getUserInfo = getUserInfo;
