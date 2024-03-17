// import fs from "fs"

import { DataTypes } from "sequelize";
import sequelize from "./src/database/connect.js";

// fs.unlinkSync('./testimage/image1.txt')

const testusers=sequelize.define('testusers',{
    name:DataTypes.STRING
})
await sequelize.sync()

const followtabs=sequelize.define('followtabs',{//he follows him
//     testuserId:{
//         type:DataTypes.INTEGER,
//         references:{
//             model:testusers,
//             key:'id'
//         }
//     },
//     followerId:{
//         type:DataTypes.STRING,
//         references:{
//             model:testusers,
//             key:'id'
//         }
//     }
    testValue:{
        type:DataTypes.INTEGER,
        defaultValue:1
    }
})

testusers.belongsToMany(testusers,{as:'followers',through:'followtabs'})//do self -ref many-to-many without first defining tables
// testusers.belongsToMany(testusers,{
//     as:'followers',
//     through:followtabs,
//     foreignKey:'testuserId',
//     otherKey:'followerId'
// })
await sequelize.sync({alter:true})

// await testusers.bulkCreate([{name: 'a'},{name : 'b'},{name : 'c'}])

const t1=await testusers.findOne({where:{id:1}})
// const t2=await testusers.findOne({where:{id:2}})
const t3=await testusers.findOne({where:{id:3}})

// t1.addFollower(t2)
t1.addFollower(t3)
// console.log(await t2.countFollowers())
await sequelize.sync()