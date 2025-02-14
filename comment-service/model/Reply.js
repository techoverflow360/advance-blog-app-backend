const { DataTypes } = require('sequelize');
const sequelizePromise = require('../connection');
const { Comment } = require('./Comment');

async function setupModel() {
    
    const sequelize = await sequelizePromise;

    const Reply = sequelize.define('Reply', {
        id: {
            type: DataTypes.NUMBER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        commentId: {
            type: DataTypes.NUMBER,
            allowNull: false,
            references: {
                model: Comment,
                key: 'id'
            },
            onDelete: 'CASCADE' // Ensures replies are deleted when the comment is deleted
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        likes: {
            type: DataTypes.NUMBER,
            allowNull: true,
        },
        dislikes: {
            type: DataTypes.NUMBER,
            allowNull: true,
        }
    }, { timestamps: true });

    Reply.sync({ force: false, alter: true });
    return Reply;

}

module.exports = setupModel();
