const { DataTypes } = require('sequelize');
// const { conn: sequelizePromise } = require('../connection');
const { sequelize } = require('../connection');
const bcrypt = require('bcrypt');

async function setupModel() {
    // const sequelize = await sequelizePromise;

    const Blogger = sequelize.define('Blogger', {
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

    Blogger.beforeCreate(async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
    });

    await sequelize.sync({ force: false, alter: true });
    return Blogger;

}

module.exports = setupModel();