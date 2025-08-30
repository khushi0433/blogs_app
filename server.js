const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs')
const postRouter = require('./routes/postRoutes')
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/UserRoutes')
const commentRouter = require('./routes/commentRoutes')
const { login } = require('./Controllers/auth')
const { getUserByUsername } = require('./models/db')

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
const indexRouter = require('./index');
app.use('/', indexRouter);

app.use('/posts', postRouter);
app.use('/user', userRouter);
app.use('/comment', commentRouter);
app.use('/auth', authRouter);


app.use(async (error, req, res, next) => {
    if (req.body && req.body.username && req.body.password) {
      try {
        const user = await getUserByUsername(req.body.username)
        if (user) {
          const isPassMatch = await bcrypt.compare(
            req.body.password,
            user.password,
          )
          if (isPassMatch) {
            req.user = user
            next()
          } else
            res
              .status(403)
              .json({ error: "Forbidden: You don't have permission" })
        } else
          res.status(403).json({ error: "Forbidden: You don't have permission" })
      } catch (error) {
        res.status(500).json({ error: 'Internal Database Error' })
        console.log(error)
      }
    } else res.status(400).json({ error: 'Bad Request: Missing required fields' })
  }, login)
  
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
