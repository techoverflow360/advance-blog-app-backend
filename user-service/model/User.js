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
});

User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});

sequelize.sync({ force: false });

module.exports = User;