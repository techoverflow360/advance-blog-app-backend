const { DataTypes } = require('sequelize');
const sequelize = require('../connection');
const bcrypt = require('bcrypt');

const User = sequelize.define('Blogger', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        },
        primaryKey: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    age : {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    isAdmin:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue:false,
    },
    isDisabled:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue:false,
    },
    likedComment : {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        defaultValue: []
    },
    dislikedComment : {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        defaultValue: []
    },
    likedReply : {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        defaultValue: []
    },
    dislikedReply : {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        defaultValue: []
    },
    likedPost : {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        defaultValue: []
    },
    dislikedPost : {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        defaultValue: []
    }
});

User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});

sequelize.sync({ force: false });

module.exports = User;