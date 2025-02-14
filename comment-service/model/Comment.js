const { DataTypes } = require('sequelize');
const sequelizePromise = require('../connection');

async function setupModel() {
    const sequelize = await sequelizePromise;

    const Comment = sequelize.define('Comment', {
        id: {
            type: DataTypes.INTEGER, 
            allowNull: false, 
            autoIncrement: true,
            primaryKey: true
        },
        postId : {
            type: DataTypes.INTEGER,
            allowNull: false    
        }, 
        username : {
            type: DataTypes.STRING,
            allowNull: false
        },
        comment : {
            type: DataTypes.STRING,
            allowNull: false
        },
        likes: {
            type: DataTypes.NUMBER,
            allowNull: true,
        },
        dislikes: {
            type: DataTypes.NUMBER,
            allowNull: true,
        }
    }, { timestamps : true });


    Comment.sync({ force : false, alter: true });
    return Comment;

}

module.exports = setupModel();