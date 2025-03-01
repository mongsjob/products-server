const express = require('express');
const Info = require('../model/info.model');

const router = express.Router();

router.post('/create-post', async (req, res) => {
    try {
        const newPost = new Info({...req.body});
        await newPost.save();
        res.status(201).send({
            message: 'Post created successfully',
            post: newPost
        })
    } catch (error) {
        console.error('Error creating post', error);
        res.status(500).send({ message: 'Error creating post' });
    }
})
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