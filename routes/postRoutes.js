const { Router } = require('express');
const {
    getAllPosts,
    createPost,
    getPostById,
    deletePost,
    updatePost,
    getAllPublicPosts,
    setPostPublic,
    setPostPrivate
} = require('../models/db');

const { auth, isAdmin, login } = require('../Controllers/auth');

const postRouter = Router();

postRouter.get('/', async (req,res) => {
    let jump = 0
    if (req.params.j) {
        jump = req.query.j * 10
    }
    try {
        const posts = await getAllPublicPosts()
        res.json(posts)
    } catch (error) {
        res.status(500).json({ error: 'iternal Database Error'})
    }
})

postRouter.get('/all', auth, isAdmin, async (req, res) => {
    let jump = 0
    if (req.query.j) {
      jump = req.query.j * 10
    }
    try {
      const posts = await getAllPosts()
      res.json(posts)
    } catch (error) {
      res.status(500).json({ error: 'Internal Database Error' })
    }
  })

  postRouter.post('/:id/setpublic', auth, isAdmin, async (req,res) => {
    try {
        await setPostPublic(req.params.id)
        res.status(200).json({ status: 'Request successfull'})
    } catch (error) {
        res.status(500).json({ error: 'iternal Database Error'});
    }
  });

  postRouter.post('/:id/setprivate', auth, isAdmin, async (req,res) => {
    try {
        await setPostPrivate(req.params.id)
        res.status(200).json({ status: 'Request succesfull'})
    } catch (error) {
        res.status(500).json({ error: 'iternal database error'});
    };
  });

  postRouter.post('/', auth, isAdmin, async (req, res) => {
    try {
      if (!(req.body.title && req.body.text && req.user.id)) {
        res.status(400).json({ error: 'Bad Request: Missing required fields ' })
      }
  
      await createPost(req.body.title, req.body.text, req.user.id)
      res.status(200).json({ status: 'Data sent successfull' })
    } catch (error) {
      res.status(500).json({ error: 'Internal Database Error' })
    }
  })

  postRouter.get('/:id', async (req, res) => {
    try {
      const post = await getPostById(req.params.id)
      res.json(post)
    } catch (error) {
      res.status(500).json({ error: 'Internal Database Error' })
    }
  })

  
postRouter.delete('/:id', async (req, res) => {
    try {
      await deletePost(req.params.id)
      res.status(200).json({ status: 'Request successfull' })
    } catch (error) {
      res.status(500).json({ error: 'Internal Database Error' })
    }
  })
  
  postRouter.put('/:id', auth, async (req, res) => {
    try {
      const post = await getPostById(req.params.id)
      if (post.authorId === req.user.id) {
        try {
          if (req.body.title && req.body.text) {
            await updatePost(req.body.title, req.body.text, req.params.id)
            res.status(200).json({ status: 'Request successfull' })
          } else
            res
              .status(400)
              .json({ error: 'Bad Request: Missing required fields ' })
        } catch (error) {
          res.status(500).json({ error: 'Internal Database Error' })
        }
      } else {
        res.status(403).json({ error: "Forbidden: You don't have permission" })
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Database Error' })
    }
  })
  
  postRouter.use('/:id/comments', (req, res, next) => {
    req.postId = req.params.id
    const red = '/comments?postid=' + req.params.id
    res.redirect(red)
  })
  
  module.exports = postRouter  