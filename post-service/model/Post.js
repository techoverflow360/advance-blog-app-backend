const { DataTypes } = require('sequelize');
const sequelizePromise = require('../connection');

async function setupModel() {
    const sequelize = await sequelizePromise;

    const Post = sequelize.define('Post', {
        id: {
            type: DataTypes.INTEGER, 
            allowNull: false,
            autoIncrement: true,     
            primaryKey: true,  
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        likes: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        dislikes: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        likedUser : {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
            defaultValue: []
        },
        dislikedUser : {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
            defaultValue: []
        }
    }, { timestamps: true });

    sequelize.sync({ force: false, alter: true });
    return Post;

}

module.exports = setupModel();
