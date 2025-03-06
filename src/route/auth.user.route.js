const express = require('express');
const mongoose = require('mongoose');
const User = require('../model/user.model');
const generateToken = require('../middleware/generateToken');

const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
    try {
        const {email, password, username} = req.body;
        const user = new User({email, password, username});
        await user.save();
        res.status(200).send({message: 'User registration successful', user: user});
    } catch (error) {
      console.error(error, 'Failed to resgiter');
      res.status(500).json({message: 'Registration failed'});  
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).send({message: 'User not found'});
        }
        const isMatch = await user.comparePassword(password);

        if(!isMatch){
            return res.status(401).send({message: 'Invalid password'});
        }

        // generate token here
        const token = await generateToken(user._id);
        // set token to browser cookies
        res.cookie('token', token, {
            httpOnly: true,  //enable this only when you have https://
            secure: true,
            sameSite: true
        });
        res.status(200).send({message: 'User login successful',token, user: {
            _id: user._id,
            email: user.email,
            username: user.username,
            role: user.role
        }});
    } catch (error) {
        console.error(error, 'Failed to login');
        res.status(500).json({message: 'Login failed! Try again'});
    }
});

// Logout User
router.post('/logout', async (req, res) => {
    try {
        // Clear the token from cookies
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'None'  // Fixed issue
        });

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error, 'Failed to log out');
        res.status(500).json({ message: 'Logout failed! Try again' });
    }
});

// Get All Users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '_id email role'); // Optimized query
        res.status(200).json({ message: 'Users found successfully', users });
    } catch (error) {
        console.error(error, 'Failed to get users');
        res.status(500).json({ message: 'Failed to get users' });
    }
});

// Delete User
router.delete('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully', user });
    } catch (error) {
        console.error(error, 'Failed to delete user');
        res.status(500).json({ message: 'Failed to delete user' });
    }
});

module.exports = router;
