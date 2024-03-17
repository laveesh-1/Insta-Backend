import { DataTypes } from "sequelize";
import sequelize from "../database/connect.js";

const users=sequelize.define('users',{
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    userName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    profilePic:{
        type:DataTypes.STRING,
        defaultValue:"noImage.jpg"
    },
    priv:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

export default users