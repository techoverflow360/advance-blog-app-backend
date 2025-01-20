const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

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
}, { timestamps: true });

sequelize.sync({ force: false });

module.exports = Post;
