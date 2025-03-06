const express = require('express');
const Info = require('../model/info.model');

const router = express.Router();

router.post('/create-post', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password required" });
        }

        const newPost = new Info({ email, password });
        await newPost.save();

        res.status(201).json({
            message: 'Post created successfully',
            post: newPost
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Error creating post', error: error.message });
    }
});

// get all posts

router.get('/', async (req, res) => {
    try {
        const posts = await Info.find();
        res.send({message: "All posts gotten successfully", posts});
    } catch (error) {
        console.error('Error getting posts', error);
        res.status(500).send({ message: 'Error getting posts' });
    }
});

// delete posts

router.delete('/:id', async (req, res) => {
    try {
        const post = await Info.findByIdAndDelete(req.params.id);
        if(!post) return res.status(404).send({ message: 'Post not found' });
        res.send({ message: 'Post deleted successfully', post });
    } catch (error) {
        console.error('Error deleting post', error);
        res.status(500).send({ message: 'Error deleting post' });
    }
});

module.exports = router;