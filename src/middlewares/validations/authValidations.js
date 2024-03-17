import { body,validationResult } from "express-validator";
import users from "../../models/userModel.js";

const signupVal=[
    body('name')
            .notEmpty().withMessage('name cant be empty')
            .isAlpha().withMessage('name can only be alphabetic chars'),
    body('email')
                .notEmpty().withMessage('email cant be empty')
                .isEmail().withMessage('not a email address')
                .custom(async(value)=>{
                    const user=await users.findOne({where:{email:value}})
                    if(user){
                        throw new Error('email already exists ')
                    }
                }),
    body('userName')
                .notEmpty().withMessage('username cant be empty')
                .custom(async(value)=>{
                    console.log(value)
                    const user=await users.findOne({where:{userName:value}})
                    if(user){
                        throw new Error('username taken')
                    }
                }),
    body('password')
                .notEmpty({minLength:8}).withMessage('password cant be empty')
                .isStrongPassword().withMessage('enter a strong password'),
    (req,res,next)=>{
        let err=validationResult(req)
        if(!err.isEmpty())
            return res.status(422).json({err: err.array()})
        next()
    }
]

const loginVal=[
    body('userName')
                .notEmpty().withMessage('username cant be empty'),
                // .custom(async(value)=>{
                //     const user=await users.findOne({where:{userName:value}})
                //     if(!user){
                //         throw new Error('no such username')
                //     }
                // }), 
    body('password')
                .notEmpty().withMessage('empty password'),
    (req,res,next)=>{
        let err=validationResult(req)
        if(!err.isEmpty()){
            return res.status(422).json({err : err.array()})
        }
        next()
    }]

export {signupVal,loginVal}