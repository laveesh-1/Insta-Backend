import multer from "multer";
import path from 'path';
import { fileURLToPath } from 'url';

const storageForPosts=multer.diskStorage({
    destination:function(req,file,cb){
        const dirpath='../../public/posts'
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename)
        const resolvedpath=path.resolve(__dirname,dirpath)
        cb(null,resolvedpath)
    },
    filename:function(req,file,cb){
        let fn=`${Date.now()}_${file.originalname}`
        cb(null,fn)
    }
})

const uploadPostsFiles=multer({storage:storageForPosts})


const storageForProPic=multer.diskStorage({
    destination:function(req,file,cb){
        const dirpath='../../public/profilePics'
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename)
        const resolvedpath=path.resolve(__dirname,dirpath)
        cb(null,resolvedpath)
    },
    filename:function(req,file,cb){
        let fn=`${Date.now()}_${file.originalname}`
        cb(null,fn)
    }
})

const uploadProPic=multer({storage:storageForProPic})



export {uploadPostsFiles,uploadProPic}