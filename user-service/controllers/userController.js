const { generateToken } = require('../utils/jwtUtil');
const bcrypt = require('bcrypt');
const User  = require('../model/User');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email) return res.status(400).json({ message : "email is empty !"});
        if(!password) return res.status(400).json({ message : "password is empty !"});
        const user = await User.findByPk(email);
        if(!user) return res.status(400).json({ message : "User doesnot found with this email !"});
        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword) return res.status(400).json({ message : "Password is incorrect !"});
        const payload = { email : user.email };
        const token = generateToken(payload);
        res.status(200).json({ message : "User found and logged in !", token : token });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal server error !"})
    }
}

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if(!username) return res.status(400).json({ message : "Username is empty !" });
        if(!email) return res.status(400).json({ message : "Email is empty !" });
        if(!password) return res.status(400).json({ message : "Password is empty !" });
        const checkUsername = await User.findOne({ where: { username: username } });
        if(checkUsername) return res.status(400).json({ message : "Username is already taken !" });
        const checkEmail = await User.findOne({ where: { email: email } });
        if(checkEmail) return res.status(400).json({ message : "Email is already taken "});
        const user = await User.create({ username, email, password });
        return res.status(200).json({ message: "User created successfully !", user : user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal server error !"})
    }
}

const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id);
        if(!user) return res.status(400).json({ message : "User not found !" });
        return res.status(200).json({ message : "User found !", user : user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal server error !"})
    }
}

const updateUser = async (req, res) => {
    try {
        // to update, pass data in body and id in params
        const id = req.params.id;
        const { username, firstName, lastName, age } = req.body;
        const user = await User.findByPk(id);
        if(!user) return res.status(400).json({ message: "User not found !" });
        let checkUsername;
        if(username) checkUsername = await User.findOne({ where: { username : username }});
        if(checkUsername && user.email !== checkUsername.email) return res.status(400).json({ message: "Username already taken, please choose another one"});
        if(username) user.username = username;
        if(firstName) user.firstName = firstName;
        if(lastName) user.lastName = lastName;
        if(age) user.age = age;
        const updatedUser = await user.save();
        return res.status(200).json({ message: "User is updated !", user: updatedUser });

    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal server error !"})
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id);
        if(!user) return res.status(400).json({ message : "User not found !" });
        await user.destroy();
        return res.status(200).json({ message : "User deleted successfully !"});    
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal server error !"})
    }
}

const resetPassword = async (req, res) => {
    try {
        const id = req.params.id;
        const { password } = req.body;
        const user = await User.findByPk(id);
        if(!user) return res.status(400).json({ message : "User not found !" });
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({ message : "Password is reset successfully !" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message : "Internal Server error !"});
    }
}

module.exports = {
    login , register, getUser, updateUser, deleteUser, resetPassword
}

