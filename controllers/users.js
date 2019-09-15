const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    if (body.username.length < 3 || body.password.length < 3) {
      return response
        .status(400)
        .json({ error: 'username and password must be at least 3 characters.' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const saveUser = await user.save()

    response.json(saveUser)
  } catch(exception) {
    next(exception)
  }
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', {
      likes: 1,
      title: 1,
      author: 1,
      url: 1
    })
  response.json(users.map(u => u.toJSON()))
})

module.exports = usersRouter
