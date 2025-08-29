const { Router, json} = require('express');

const userRouter = Router()

const {
    getAllUsers,
    getUserById,
    deleteUser,
    makeAdminById,
} = require('../models/db')

const { auth, isAdmin } = require('../Controllers/auth');

userRouter.get('/', auth, isAdmin, async (req, res) => {
    try {
      const users = await getAllUsers()
      res.json(users)
    } catch (error) {
      res.status(500).json({ error: 'Internal Database Error' })
    }
  })

  userRouter.get('/:id', auth, isAdmin, async (req,res) => {
    try {
        const user = await getUserById(req.params.id)
        res.json(user)
    } catch (error) {
        res.status(500).json({ error: 'Iternal Database Error'})
    }
  });

  userRouter.delete('/:id', auth, isAdmin, async (req,res) => {
    try {
        await deleteUser(req.params.id)
        res.status(200).json({ status: 'successfully deleted user'});
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error Deleting User'})
    };
  });

  userRouter.put('/:id/makeAdmin', auth, isAdmin, async (req,res) => {
    try {
        await makeAdminById(req.params.id)
        res.status(200).json({ status: 'Successfully made user Admin'});
    } catch (error) {
        res.status(500).json({ error: 'internal Database Error'});
    }
  });

  module.exports = userRouter;