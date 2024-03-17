import users from "../models/userModel.js";
import bcrypt from "bcrypt"
import fs from "fs"
import path from "path";
import { fileURLToPath } from 'url';


const updateProfile=async(req,res)=>{
    try{ console.log(req.file)
        if(req.body.password || req.body.prev){
            return res.status(422).json({msg : 'change password and private with different api'})
        }

        const user=await users.findOne({where:{id:req.user_info.id}})

        if(req.file){
            user.profilePic=req.file.filename
            //remove prev file from memory
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename)
            let resolvedPath=path.resolve(__dirname,`../../public/profilePics/${user.profilePic}`)
            fs.unlinkSync(resolvedPath)
        }
        Object.keys(req.body).forEach(key=>{
            if(user[key] && key!='profilePic'){//profile pic shud be handled above
                user[key]=req.body[key]
            }
        })

        const savedUser=await user.save()
        if(!savedUser){
            return res.status(500).json({msg : 'cant be updated  now,try again later'})
        }

        return res.status(200).json({
            msg : 'update successful',
            'data': user
        })
    }catch(e){
        console.log(e)
        return res.status(500).json({msg : 'try again later'})
    }
}

const resetPassword=async(req,res)=>{
    try{
        if(req.body.newPs != req.body.newPsAgain){
            return res.status(422).json({msg : 'both must be same'})
        }
        let s=await bcrypt.genSalt(10)
        let hp=await bcrypt.hash(req.body.newPs,s)

        const up=await users.update({password:hp},{where:{id:req.user_info.id}})
        if(!up){
            return res.status(500).json({msg : 'cant reset password now'})
        }
        return res.status(200).json({msg : 'password has been reset'})
    }catch(e){
        console.log(e)
        res.status(500).json({msg : 'try agin later'})
    }
}

const showOwnProfile=async(req,res)=>{
    try{
        const user=await users.findOne({where:{id:req.user_info.id}})
        return res.status(200).json({
            msg : 'here is the data',
            'data': user
        })
    }catch(e){
        console.log(e)
        return res.status(500).json({msg : 'cant show now ,try again later'})
    }
}

const deleteProfile=async(req,res)=>{
    try{
        const user=await users.findOne({where:{id:req.user_info.id}})
        if(user.profilePic!='noImage.jpg'){//because we dont want to delete default
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename)
            let resolvedPath=path.resolve(__dirname,`../../public/profilePics/${user.profilePic}`)
            fs.unlinkSync(resolvedPath)
        }

        await users.destroy({where:{id:req.user_info.id}})
        return res.status(200).json({msg : 'user deleted'})
    }catch(e){
        console.log(e)
        return res.status(500).json({msg : 'cant delete now,try again later'})
    }
}
export {updateProfile, resetPassword, showOwnProfile, deleteProfile}