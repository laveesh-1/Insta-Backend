import { DataTypes } from "sequelize"
import sequelize from "../database/connect.js"

const comments=sequelize.define('comments',{//comments on posts
    content:{
        type:DataTypes.TEXT
    }
})

export default comments