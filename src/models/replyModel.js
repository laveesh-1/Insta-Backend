import { DataTypes } from "sequelize"
import sequelize from "../database/connect.js"

const replies=sequelize.define('replies',{//comments on comments
    content:{
        type:DataTypes.TEXT
    }
})

export default replies