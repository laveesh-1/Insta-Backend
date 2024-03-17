import { DataTypes } from "sequelize";
import sequelize from "../database/connect.js";
import users from "./userModel.js";


const followingrecords=sequelize.define('followingrecords',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    userId:{
        type:DataTypes.INTEGER,
        references:{
            model:users,
            key:'id'
        }
    },
    followingId:{
        type:DataTypes.INTEGER,
        references:{
            model:users,
            key:'id'
        } 
    },
    //avoid defining above TWO columns in self ref many to many,just write additional colmns and let seq.
    //handle creating above two,and if additional col are not required then leave create this table altogether 

    accepted:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
})

export default followingrecords