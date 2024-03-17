import express from "express";
import { signup, login } from "../controllers/authControllers.js";
import { signupVal, loginVal } from "../middlewares/validations/authValidations.js";
import { updateProfile, resetPassword, showOwnProfile, deleteProfile } from "../controllers/userProfileControllers.js";
import { createPost, deletePost, editPost, addComment, addReply, editComment, editReply, deleteComment, deleteReply, like, getPost, getLikes, getComments, getReplies, blockUser, unblockUser, showBlockList, follow, unFollow, showsentFollowReq, showReceivedFollowReq, acceptFollowReq, showFollowing, showFollowers, unSendFolReq, declineFolReq } from "../controllers/functioningControllers.js";
import { verTok } from "../middlewares/verifyUserToken.js";
import { uploadPostsFiles, uploadProPic} from "../middlewares/multers.js";


const userRouter=express.Router()


userRouter.post('/signup',signupVal,signup)
userRouter.post('/login',loginVal,login)
// userRouter.post('/createpost',verTok,upload.array('file',[1]),createPost)
// userRouter.post('/createpost',verTok,upload.fields([{name:'file',maxCount:1}]))
userRouter.post('/createpost',verTok,uploadPostsFiles.single('file'),createPost)
userRouter.delete('/deletepost',verTok,deletePost)
userRouter.patch('/updateprofile',verTok,uploadProPic.single('profilePic'),updateProfile)
userRouter.patch('/resetpassword',verTok,resetPassword)
userRouter.get('/showownprofile',verTok,showOwnProfile)
userRouter.delete('/deleteprofile',verTok,deleteProfile)
userRouter.patch('/editpost',verTok,uploadPostsFiles.single('file'),editPost)
userRouter.post('/addcomment',verTok,addComment)
userRouter.post('/addreply',verTok,addReply)
userRouter.patch('/editcomment',verTok,editComment)
userRouter.patch('/editreply',verTok,editReply)
userRouter.delete('/deletecomment',verTok,deleteComment)
userRouter.delete('/deletereply',verTok,deleteReply)
userRouter.get('/getpost',verTok,getPost)
userRouter.get('/getlikes',verTok,getLikes)
userRouter.get('/getcomments',verTok,getComments)
userRouter.get('/getreplies',verTok,getReplies)

userRouter.post('/like',verTok,like)//for post,comment,reply
userRouter.put('/blockuser',verTok,blockUser)
userRouter.put('/unblockuser',verTok,unblockUser)
userRouter.get('/showBlockList',verTok,showBlockList)
userRouter.post('/follow',verTok,follow)
userRouter.put('/unfollow',verTok,unFollow)
userRouter.get('/showsentfollowreq',verTok,showsentFollowReq)
userRouter.get('/showreceivedfollowreq',verTok,showReceivedFollowReq)
userRouter.put('/acceptfollowreq',verTok,acceptFollowReq)
userRouter.get('/showfollowing',verTok,showFollowing)
userRouter.get('/showfollowers',verTok,showFollowers)
userRouter.put('/unsendfolreq',verTok,unSendFolReq)
userRouter.put('/declinefolreq',verTok,declineFolReq)


//validations and auth left (only made for login and signup till now)
//3 api's left -decline req,setaccount private,setaccount public
//some other changes 
export default userRouter