import express  from "express";
import bodyParser from "body-parser";
import userRouter from "./src/routes/userRoutes.js";
import associate from "./src/models/associations.js";


const app=express()
associate()

const port=8081
app.listen(port,()=>{
    console.log(`Server is listeneing on port ${port}`)
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))



app.use('/user',userRouter)


