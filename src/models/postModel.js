import { DataTypes } from "sequelize";
import sequelize from "../database/connect.js";

const posts=sequelize.define('posts',{
    file:{
        type:DataTypes.STRING
    },
    content:{
        type:DataTypes.TEXT
    }
})

export default posts