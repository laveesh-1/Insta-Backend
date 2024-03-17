import users from "../models/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

async function signup(req, res) {
    
    try {
        let s=await bcrypt.genSalt(10)
        let hp=await bcrypt.hash(req.body.password,s)//hp-hashed password
        let obj = {
            name: req.body.name,
            userName: req.body.userName,
            email: req.body.email,
            password: hp,
            profilePic:'noImage.jpg'
        }

        let user = await users.create(obj) ;
        if(!user) {
            return res.json({
                msg : 'unable to create user.'
            })
        }

        return res.json({
            msg : 'user registered successfully.',
            data : user
        })

    } catch (error) {
        console.log(error);
        return res.json({error : 'something went wrong!'})
    }
}

let login=async(req,res)=>{
    let userName=req.body.userName
    let password=req.body.password
    try{
        const user= await users.findOne({where:{userName:userName}})
        if(!user){
            return res.status(422).json({msg : 'Invalid Credentials'})
        }

        const r=await bcrypt.compare(password,user.password)
        if(!r){
            return res.status(422).json({msg : 'Invalid Credentials'})
        }
        const payload={
            id:user.id
        }

        jwt.sign( payload, 'secret' , {expiresIn:24*60*60}, (err,token)=>{
            if(!token){
                console.log(err)
                return res.status(500).json({msg : 'pls try again later '})
            }
            console.log(token)
            return res.status(422).json({
                msg : 'Logged In',
                'token':token
            })
        })
    }catch(e){
        console.log(e)
        return res.status(500).json({msg : 'cant login now,try again later'})
    }
}

export {signup,login} 