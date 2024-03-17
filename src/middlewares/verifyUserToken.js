import jwt from "jsonwebtoken"

export function verTok(req,res,next){
    if(!req.headers.authorization){
        return res.send('No Credentials Sent') ;
    }
    try{
        const auth = req.headers.authorization//token
        const tok = auth.split(' ')[1]//actual token
        const result = jwt.verify(tok,'secret') ;//sync and callback

        if(result){
            req.user_info = result ;
            next() ;
        }
    }catch(e){
        console.log(e)    
        return res.json({error : 'something went wrong!'})
    }
}

