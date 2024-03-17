import sequelize from "../database/connect.js";
import users from "./userModel.js";
import posts from "./postModel.js";
import comments from "./comments.js";
import replies from "./replyModel.js";
import likesonposts from "./likesonposts.js";
import likesoncomments from "./likesoncomments.js";
import likesonreplies from "./likesonreplies.js";


const associate=async()=>{

    //users-post
    users.hasMany(posts,{onDelete:'CASCADE'})
    posts.belongsTo(users)

    //like on posts - users and post
    posts.hasMany(likesonposts,{onDelete:'CASCADE'})
    likesonposts.belongsTo(posts)

    users.hasMany(likesonposts,{onDelete:'CASCADE'})
    likesonposts.belongsTo(users)

    //like on comments-comments and users
    comments.hasMany(likesoncomments,{onDelete:'CASCADE'})
    likesoncomments.belongsTo(comments)

    users.hasMany(likesoncomments,{onDelete:'CASCADE'})
    likesoncomments.belongsTo(users)

    //like on replies-replies and users
    replies.hasMany(likesonreplies,{onDelete:'CASCADE'})
    likesonreplies.belongsTo(replies)

    users.hasMany(likesonreplies,{onDelete:'CASCADE'})
    likesonreplies.belongsTo(users)
                
    //comments on posts - users and posts
    posts.hasMany(comments,{onDelete : 'CASCADE'})
    comments.belongsTo(posts)

    users.hasMany(comments,{onDelete : 'CASCADE'})
    comments.belongsTo(users)

    //replies- comment and users
    comments.hasMany(replies,{onDelete : 'CASCADE'})
    replies.belongsTo(comments)

    users.hasMany(replies,{onDelete : 'CASCADE'})
    replies.belongsTo(users)

    // await sequelize.sync({alter:true})
    //following- users to users
    users.belongsToMany(users,{
        through:'followingrecords',
        as:'followings',
        foreignKey:'userId',
        otherKey:'followingId'
    })

    //blockrecords
    users.belongsToMany(users,{
        as:'blockeds',
        through:'blockrecords',
    })


    await sequelize.sync()
    //***sync is a very important and powerfull fn,use it properly 
}

export default associate