import posts from "../models/postModel.js";
import comments from "../models/comments.js";
import fs, { rmSync } from "fs"
import path from "path";
import { fileURLToPath } from 'url';
import replies from "../models/replyModel.js";
import sequelize from "../database/connect.js";
import likesoncomments from "../models/likesoncomments.js";
import likesonreplies from "../models/likesonreplies.js"
import blockrecords from "../models/blockrecords.js";
import followingrecords from "../models/followingrecords.js";
import users from "../models/userModel.js";


let createPost=async(req,res)=>{
    try{
        console.log(req.file)
        let p=''
        if(!req.file){
            p=await posts.create({content:req.body.content,userId:req.user_info.id}) 
        }
        else if(!req.body.content){
            p=await posts.create({file:req.file.filename,userId:req.user_info.id}) 
        }else{
            p=await posts.create({content:req.body.content,file:req.file.filename,userId:req.user_info.id}) 
        }

        if(!p){
            return res.status(500).json({msg : 'cant post now! try again later'})
        }
        return res.status(200).json({
            msg : 'post created',
            postId:p.id
        })
    }catch(e){
        console.log(e)
        return res.status(500).json({msg : 'try again later'})
    }
}

const deletePost=async(req,res)=>{
    try{ 
        let post=await posts.findOne({where:{id:req.body.postId}})

        if(!post){
            return res.status(404).json({msg : 'no such post'})
        }

        if(post.userId!=req.user_info.id){
            return res.status(403).json({msg : 'unauthorised'})
        }

        let postsFile=post.file
        if(postsFile!=null){
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename)
            let resolvedPath=path.resolve(__dirname,`../../public/posts/${postsFile}`)
            fs.unlinkSync(resolvedPath)
        }

        let delres =await posts.destroy({where:{id:req.body.postId}})
        if(!delres){
            return res.status(500).json({msg : 'cant delete now'})
        }
        return res.status(200).json({msg : 'post deleted successfully'})

    }catch(e){
        console.log(e)
        res.status(422).json({msg: 'try again later'})
    }
}

const editPost=async(req,res)=>{//here we dont want to keep rpev values.if we dont receive anything,values will become empty
    try{
        const post=await posts.findOne({where:{id:req.body.postId}})
        if(post.userId!=req.user_info.id){
            return res.status(403).json({msg : 'you cant edit his post'})
        }

        if(req.file){
            if(post.file){
                const __filename = fileURLToPath(import.meta.url);
                const __dirname = path.dirname(__filename)
                let resolvedPath=path.resolve(__dirname,`../../public/posts/${post.file}`)
                fs.unlinkSync(resolvedPath)
            }
            post.file=req.file.filename
            //remove prev file from memory
        }else{
            if(post.file){
                const __filename = fileURLToPath(import.meta.url);
                const __dirname = path.dirname(__filename)
                let resolvedPath=path.resolve(__dirname,`../../public/posts/${post.file}`)
                fs.unlinkSync(resolvedPath)
            }
            post.file=null
        }

        if(req.body.content){
            post.content=req.body.content
        }else{
            post.content=null
        }

        const savedPost=await post.save()
        if(!savedPost){
            return res.status(500).json({msg : 'cant be edited  now,try again later'})
        }

        return res.status(200).json({
            msg : 'edit successful'
        })
    }catch(e){
        console.log(e)
        return res.status(500).json({msg : 'try again later'})
    }
}

const addComment=async(req,res)=>{
    try{
        let obj={
            userId:req.user_info.id,
            postId:req.body.postId,
            content:req.body.content
        }
        const comment=await comments.create(obj)

        return res.status(200).json({
            msg : 'comment addded',
            'data': comment
        })
    }catch(e){
        console.log(e)
        return res.status(500).json({msg : 'try again later'})
    }
}

const editComment=async(req,res)=>{
    try{
        let updReply=await comments.update({content:req.body.content},{where:{id:req.body.commentId}})

        return res.status(200).json({msg : 'comment updated'})
    }catch(e){
        console.log(e)
        return res.status(500).json({msg : 'try agian later'})
    }
}

const deleteComment=async(req,res)=>{
    try{
    let delCom=await comments.destroy({where:{id:req.body.commentId}})

    return res.status(200).json({msg : 'delete successful'})

    }catch(e){
        console.log(e)
        return res.status(500).json({msg : 'try again later'})
    }
}

const addReply=async(req,res)=>{
    try{
        let obj={
            content: req.body.content,
            userId: req.user_info.id,
            commentId:req.body.commentId
        }
        const reply=await replies.create(obj)
        
        return res.status(200).json({msg : 'reply added', 'id': reply.id})
    }catch(e){
        console.log(e)
        return res.status(500).json({msg : 'try again later'})
    }
}

const editReply=async(req,res)=>{
    try{
        let updReply=await replies.update({content:req.body.content},{where:{id:req.body.replyId}})

        return res.status(200).json({msg : 'reply updated'})
    }catch(e){
        console.log(e)
        return res.status(500).json({msg : 'try agian later'})
    }
}

const deleteReply=async(req,res)=>{
    try{
    let delReply=await replies.destroy({where:{id:req.body.replyId}})

    return res.status(200).json({msg : 'delete successful'})

    }catch(e){
        console.log(e)
        return res.status(500).json({msg : 'try again later'})
    }
}

const like=async(req,res)=>{
    try{
        const mod=req.body.mod
        const modId=req.body.modId

        let actualMod=''
        if(mod=='comment'){
            actualMod=`likesoncomments`
        }
        if(mod=='post'){
            actualMod=`likesonposts`
        }
        if(mod=='reply'){
            actualMod=`likesonreplies`
        }

        actualMod=sequelize.model(actualMod)//now actualMod reders to a model

        let modSp=await actualMod.findOne({where:{[`${mod}Id`]:req.body.modId,userId:req.user_info.id}})//specific mod
        // console.log(modSp,modId,req.user_info.id)
        // console.log(`${mod}Id`)

        if(modSp){
            await modSp.destroy()

            return res.status(200).json({msg : `unliked ${mod}`}) 
        }
        let obj={
            userId:req.user_info.id,
            [`${mod}Id`]:modId
        }
        modSp=await actualMod.create(obj)//now modsp is table row

        return res.status(200).json({msg : `liked ${mod}`})
    }catch(e){
        console.log(e)
        res.status(500).json({msg : 'try again later'})
    }
}

const getPost=async(req,res)=>{
    try{
        const post =await posts.findOne({
            where:{id:req.query.id},
            // attributes:['file','content'],
        })
        console.log(post)
        return res.status(200).json({
            msg : "here is posts data",
            data: post,
            likes: await post.countLikesonposts(),
            comments: await post.countComments()
        })
    }catch(e){
        console.log(e)
        res.status(500).json({msg : 'try again later'})
    }
}

const getLikes=async(req,res)=>{
    try{
        let mod=req.query.mod
        let modId=req.query.modId

        let actualMod=''
        switch(mod){
            case 'post':{
                actualMod='likesonposts'
                break
            }
            case 'comment':{
                actualMod='likesoncomments'
                break
            }
            case 'reply':{
                actualMod='likesonreplies'
                break
            }
        }

        actualMod=sequelize.model(actualMod)

        const likes=await actualMod.findAll({where:{[`${mod}id`]:modId}})

        return res.status(200).json({
            msg : 'here is the data',
            data: likes
        })

    }catch(e){
        console.log(e)
        res.status(200).json({msg : 'try again later'})
    }
}

const getComments=async(req,res)=>{
    // try{
    //     let comments=await comments.findAll({where:{postId:req.query.postId}})
    //     return res.status(200).json({msg: 'here are all the comments',data: comments})
    // }catch(e){
    //     console.log(e)
    //     return res.status(500).json({msg: 'try again later'})
    // }
    try{
        // let commentsList=await comments.findAll({
        //     where:{postId:req.query.postId},
        //     include:{
        //         model:likesoncomments,
        //         attributes:[]
        //         // attributes:[sequelize.fn('COUNT',sequelize.col('likesoncomments.id')),'likescount'],
        //     },
        //     attributes:['id','content',[sequelize.fn('COUNT','likesoncomments.commentId'),'likescount']],
        //     // attributes:[sequelize.literal('(SELECT COUNT(*) FROM "likesoncomments" WHERE "likesoncomments"."commentId" = comment.id)'), 'likesoncomCount']
        //     group:['comments.id']
    // })
        let commentsList = await comments.findAll({
            where: { postId: req.query.postId },
            include: [{
                model: likesoncomments,
                attributes: []
            },
            {
                model:replies,
                attributes:[]
            }],
            attributes: [
              'id',
              'content',
              [
                sequelize.literal('(SELECT COUNT(*) FROM likesoncomments WHERE likesoncomments.commentId = comments.id)'),'likesCount'
              ],
              [
                sequelize.literal('(SELECT COUNT(*) FROM replies WHERE replies.commentId=comments.id)'),'repliesCount'
              ]
            ],
            // group: ['comments.id', 'comments.content'], //its written for the att you selected along with count 
            //its working here,but in other tables you will have to use it
          });


        return res.status(200).json({data : commentsList})
    }catch(e){
        console.log(e)
        res.status(500).json({msg :'try again later' })
    }
}

const getReplies=async(req,res)=>{
    try{
        let replyList=await replies.findAll({
            where:{commentId:req.query.commentId},
            include:{
                model:likesonreplies,
                attributes:[]
            },
            attributes:[
                'id',
                'content',
                [sequelize.literal('(SELECT COUNT(*) FROM likesonreplies WHERE likesonreplies.replyId=replies.id )'),'likesCount']
            ],
            // group:['replies.id','replies.content']

        })

        return res.status(200).json({data: replyList})
    }catch(e){
        console.log(e)
        return res.status(500).json({msg : 'try again later'})
    }
}

const blockUser=async(req,res)=>{

    if(req.body.idToBlock==req.user_info.id){
        return res.status(400).json({msg : "can't block self"})
    }

    const blockRecord= await blockrecords.findOne({
        where:{
            userId:req.user_info.id,
            blockedId:req.body.idToBlock
        }})
    if(blockRecord){
       return res.status(400).json({msg : 'this user is already blocked by you'})
    }
    
    //when block.remove him from follow
    const blocked=blockrecords.create({
        userId:req.user_info.id,
        blockedId:req.body.idToBlock
    })

    if(blocked){
        return res.status(200).json({msg : 'blocked user'})
    }
}

const showBlockList=async(req,res)=>{
    try{
        const blockList=await blockrecords.findAll({
            where:{userId:req.user_info.id}
        })
        if(!blockList){
            return res.status(500).json({msg : 'cant proceed now'})
        }
        if(blockList.length==0){
            return res.status(200).json({msg : 'you havent blocked anyone'})
        }

        return res.status(200).json({
            msg : 'here is the blocked list',
            data: blockList
        })

    }catch(e){
        console.log(e)
        return res.status(500).json({msg : 'try again later'})
    }
}
const unblockUser=async(req,res)=>{

    try{
        const unBlocked = await blockrecords.findOne({
            where: {
                userId: req.user_info.id,
                blockedId: req.body.idToUnblock
            }
        })

        console.log(unBlocked)
        if (!unBlocked) {
            return res.status(409).json({ msg: 'you have not blocked this user' })
        }

        const unBlockedNow = await unBlocked.destroy()

        if (unBlockedNow) {
            return res.status(200).json({ msg: 'unblocked user' })
        }

        return res.status(500).json({ msg: 'cant proceed  now' })

    } catch(e){
        return res.status(200).json({msg : 'try again later'})
    }
}


const follow=async(req,res)=>{
    try{
        if(req.body.idToFollow==req.user_info.id){
            return res.status(409).json({msg : 'cant follow self'})
        }
        const fol=await followingrecords.findOne({
            where:{
                userId:req.user_info.id,
                followingId:req.body.idToFollow,
            }
        })
        if(fol){
            if(fol.accepted=='1'){
                return res.json(409).status({msg : 'you already follow him'})
            }
            if(fol.accepted=='0'){
                return res.status(409).json({msg : 'you have already sent friend request'})
            }
        }
    
        const personToFollow=await users.findOne({where:{id:req.body.idToFollow}})
        let accepted=1
    
        if(personToFollow.priv=='1'){
            accepted=0
        }
        const folNow=await followingrecords.create({
            userId:req.user_info.id,
            followingId:req.body.idToFollow,
            accepted:accepted
        })
    
        if(folNow){
            if(accepted==0){
                return res.status(200).json({msg : 'sent follow request'})
            }
            return res.status(200).json({msg : 'followed user'})
        }    
    }catch(e){
        console.log(e)
        return res.status(500).json({msg : 'try again later'})
    }
}

const unFollow=async(req,res)=>{
   try{
    const fol=await followingrecords.findOne({
        where:{followingId:req.body.id}
    })
    if(!fol){
        return res.status(409).json({msg : 'you dont follow him neither have you sent fol req'})
    }

    if(fol.accepted=='0'){
        return res.status(422).json({msg : 'your request has not yet been accepted(use unsend req Api)'})
    }

    const unFol=await fol.destroy()

    if(!unFol){
        res.status(500).json({ msg : 'cant proceed now'})
    }

    return res.status(200).json({msg : 'unfollowed'})

   }catch(e){
        console.log(e)
        return res.status(500).json({msg : 'try again later'})
   }
}

const showsentFollowReq=async(req,res)=>{
    try{
        const sentReqs=await followingrecords.findAll({
            where:{
                userId:req.user_info.id,
                accepted:'0'
            }
        })
    
        if(!sentReqs){
            req.status(500).json({msg : 'cant proceed now'})
        }
    
        if(sentReqs.length==0){
            return res.status(200).json({msg : 'no follow req sent'})
        }
    
        return res.status(200).json({msg : 'here is the list', data: sentReqs})
    }catch(e){
        console.log(e)
        return res.status(500).json({msg : 'try again later'})
    }
}

const showReceivedFollowReq=async(req,res)=>{
    try{
        const user=await users.findOne({where: {id:req.user_info.id}})

        if(user.priv==0){
            return res.status(409).json({msg : 'you have a public acount'})
        }

        const recFolReq=await followingrecords.findAll({
            where:{
                followingId:req.user_info.id,
                accepted:'0'
            }
        })

        if(recFolReq){
           return res.status(200).json({
            msg :'here is the list',
            data:recFolReq}) 
        }

    }catch(e){
        console.log(e)
        return res.status(500).json({msg : 'try again later'})
    }
}

const acceptFollowReq=async(req,res)=>{
    try{
        const folReqAccepted=await followingrecords.update({accepted:'1'},{where:{id:req.body.folReqId}})

        if(!folReqAccepted){
            return res.status(500).json({msg : 'cant proceed now'})
        }
    
        return res.status(200).json({msg : 'accepted req'})
    }catch(e){
        console.log(e)
        return res.status(500).json({msg : 'try again later'})
    }
}

const unSendFolReq=async(req,res)=>{
    try{
        const request=await followingrecords.findOne({
            where:{
                'id':req.body.id,
            }
        })

        if(!request){
            return res.status(400).json({msg :'you havent sent a req'})
        }

        if(request.accepted==1){
            return res.status(400).json({msg : 'use unfollow API'})
        }

        const unSent=request.destroy()
        console.log(unSent)
        if(unSent){
            return res.status(200).json({msg :'unsent req'})
        }
    }catch(e){
        console.log(e)
        return res.status(500).json({msg : 'try again later'})
    }
}

const declineFolReq=async(req,res)=>{
    try{
        const request=await followingrecords.findOne({
            where:{
                'id':req.body.id,
            }
        })

        if(!request){
            return res.status(400).json({msg :'this is not a valid reqId'})
        }

        if(request.accepted==0){
            return res.status(400).json({msg : 'use block API'})
        }

        const declined=request.destroy()
        if(declined){
            return res.status(200).json({msg :'declined req'})
        }
    }catch(e){
        console.log(e)
        return res.status(500).json({msg : 'try again later'})
    }
}

const showFollowing=async(req,res)=>{
    try{
        const followingList=await followingrecords.findAll({
            where:{
                userId:req.query.id,
                accepted:1
            }
        })

        if(!followingList){
            return res.status(500).json({msg : "cant proceed now"})
        }

        return res.status(200).json({msg : 'here is the list',following: followingList})
    }catch(e){
        console.log(e)
        res.status(500).json({msg : 'try again later'})
    }
}

const showFollowers=async(req,res)=>{
    try{
        const followersList=await followingrecords.findAll({
            where:{
                followingId:req.query.id,
                accepted:1
            }
        })

        if(!followersList){
            return res.status(500).json({msg : "cant proceed now"})
        }

        return res.status(200).json({msg : 'here is the list',followers: followersList})
    }catch(e){
        console.log(e)
        res.status(500).json({msg : 'try again later'})
    }
}

export {createPost, deletePost, editPost, addComment, addReply, editComment, editReply, deleteComment, deleteReply, like, getPost, getLikes, getComments, getReplies, blockUser, unblockUser, showBlockList, follow, unFollow, showsentFollowReq, showReceivedFollowReq, acceptFollowReq, declineFolReq, showFollowing, showFollowers, unSendFolReq}