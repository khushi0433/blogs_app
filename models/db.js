const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function getAllPosts(jump = 0, limit = 20) {
  const posts = await prisma.post.findMany({
    skip: jump,
    take: limit,
    include: { author: { select: { username: true } } },
  })

  return posts
}

async function getAllPublicPosts(jump = 0, limit = 20) {
  const posts = await prisma.post.findMany({
    where: {
      isPublished: true,
    },
    skip: jump,
    take: limit,
    include: { author: { select: { username: true } } },
  })

  return posts
}

async function getAllUsers() {
  const users = await prisma.user.findMany({})

  return users
}

async function getPostById(id) {
  const post = await prisma.post.findUnique({
    where: { id: id },
    include: { author: { select: { username: true } } },
  })

  return post
}

async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id: id },
  })

  return user
}

async function getCommentById(id) {
  const comment = await prisma.comment.findUnique({
    where: { id: id },
  })

  return comment
}

async function getPostComments(id) {
  const comments = await prisma.comment.findMany({
    where: { commentedPostId: id },
    include: { commenter: { select: { username: true } } },
  })

  return comments
}

async function createPost(title, text, authorId) {
  await prisma.post.create({
    data: {
      text: text,
      title: title,
      authorId: authorId,
    },
  })
}

async function updatePost(title, text, id) {
  await prisma.post.update({
    where: { id: id },
    data: {
      text: text,
      title: title,
    },
  })
}

async function updateComment(comment, id) {
  await prisma.comment.update({
    where: { id: id },
    data: {
      comment: comment,
    },
  })
}

async function createUser(username, password) {
  const user = await prisma.user.create({
    data: {
      username: username,
      password: password,
    },
  })

  return user
}

async function deleteUser(id) {
  await prisma.user.delete({
    where: { id: id },
  })
}

async function deletePost(id) {
  const post = await prisma.post.findUnique({ where: { id: id } })
  await prisma.comment.deleteMany({ where: { commentedPostId: post.id } })
  await prisma.post.delete({
    where: { id: id },
  })
}

async function deleteComment(id) {
  await prisma.comment.delete({
    where: { id: id },
  })
}

async function makeAdminById(id) {
  await prisma.user.update({
    where: { id: id },
    data: {
      isAdmin: true,
    },
  })
}

async function createComment(comment, userId, postId) {
  await prisma.comment.create({
    data: {
      comment: comment,
      commentedById: userId,
      commentedPostId: postId,
    },
  })
}

async function setPostPublic(id) {
  await prisma.post.update({
    where: { id: id },
    data: { isPublished: true },
  })
}

async function setPostPrivate(id) {
  await prisma.post.update({
    where: { id: id },
    data: { isPublished: false },
  })
}

async function getUserByUsername(usernmae) {
  const user = await prisma.user.findUnique({
    where: {
      username: usernmae,
    },
  })

  return user
}

module.exports = {
  getAllPosts,
  getAllPublicPosts,
  getPostById,
  getCommentById,
  getPostComments,
  createPost,
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  makeAdminById,
  deletePost,
  deleteComment,
  createComment,
  updateComment,
  updatePost,
  setPostPublic,
  setPostPrivate,
  getUserByUsername,
}