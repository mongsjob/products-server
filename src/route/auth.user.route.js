const express = require('express');
const mongoose = require('mongoose');
const User = require('../model/user.model');
const generateToken = require('../middleware/generateToken');

const router = express.Router();

// register routes
router.post('/register', async(req,res)=>{
    try {
        const { email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ email, password });
        await user.save();  // Save before sending response

        res.status(201).json({ message: 'User registration successful', user });
    } catch (error) {
        console.error(error, 'Failed to resgiter');
        res.status(500).json({message: 'Registration failed'}); 
    }
})
// login routes
router.post('/login', async(req,res)=>{
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = await generateToken(user._id);

        // Set token in cookies
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,  // Set to true if using HTTPS
            sameSite: 'None'  // Required if using secure cookies in cross-origin requests
        });

        res.status(200).json({
            message: 'User login successful',
            token,
            user: {
                _id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(error, 'Login error');
        res.status(500).json({ message: 'Login failed' });
    }
});
// logout user

router.post('/logout', async (req, res) => {
    try {
        // Clear the token from cookies
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: true
        });

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error, 'Failed to log out');
        res.status(500).json({message: 'Logout failed! Try again'});
    }
});
// get all users

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'id email role');
        res.status(200).send({message: 'Users found successfully', users});
    } catch (error) {
        console.error(error, 'Failed to get users');
        res.status(500).json({message: 'Failed to get users'});
    }
});

// delete user

router.delete('/user/:id', async (req, res) => {
    try {
        const {id} = req.params
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).send({message: 'User deleted successfully', user});
    } catch (error) {
        console.error(error, 'Failed to delete user');
        res.status(500).json({message: 'Failed to delete user'});
    }
});

module.exports = router;