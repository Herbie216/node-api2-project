const express = require('express')
const Post = require('./posts-model')

const router = express.Router()

router.get('/', (req, res) => {
    Post.find()
        .then(posts => {
            res.json(posts) // .status(200) not needed???
        })
        .catch(err => {
            res.status(500).json({
                message: "The posts information could not be retrieved",
                //err: err.message,   // for dev purposes???
                //stack: err.stack,   // for dev purposes??? 
            })
        })
})

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist",
            })
        } else {
            res.json(post) // status(200) not needed???
        }
    } catch (err) {
        res.status(500).json({
            message: "The post information could not be retrieved",
            // err: err.message,   // for dev purposes
            // stack: err.stack,   // for dev purposes 
        })
    }
})

router.post('/', (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    } else {
        Post.insert({ title, contents })
            .then(({ id }) => {
                return Post.findById(id)
            })
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                res.status(500).json({
                    message: "The post information could not be retrieved",
                    // err: err.message,   // for dev purposes
                    // stack: err.stack,   // for dev purposes 
                })
            })

    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = await Post.findById(req.params.id)
        if (!id) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            await Post.remove(req.params.id)
            res.json(id)
        }
    }
    catch (err) {
        res.status(500).json({
            message: "The post could not be removed",
            // err: err.message,   // for dev purposes
            // stack: err.stack,   // for dev purposes 
        })
    }
})

router.put('/:id', (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    } else {
        Post.findById(req.params.id)
            .then(wut => {
                if (!wut) {
                    res.status(404).json({
                        message: "The post with the specified ID does not exist"
                    })
                } else {
                    return Post.update(req.params.id, req.body)
                }
            })
            .then(data => {
                if (data) {
                    return Post.findById(req.params.id)
                }
            })
            .then(wtf => {
                if (wtf) {
                    res.json(wtf)
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: "The post information could not be modified",
                    // err: err.message,   // for dev purposes
                    // stack: err.stack,   // for dev purposes 
                })
            })
    }
})

router.get('/:id/comments', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist",
                
            })
        } else {
            const messages = await Post.findPostComments(req.params.id)
            res.json(messages)
        } 
    }
    catch (err) {
        res.status(500).json({
            message: "The comments information could not be retrieved",
            // err: err.message,   // for dev purposes
            // stack: err.stack,   // for dev purposes 
        })
    }
})

module.exports = router