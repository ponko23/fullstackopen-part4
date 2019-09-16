const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const Blog = require('../models/blog')

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  const userObject = helper.initialUsers.map(user => new User(user))
  const userPromiseArray = userObject.map(user => user.save())
  await Promise.all(userPromiseArray)
  const firstUser = await User.findOne({})
  const blogObject = helper.initialBlogs.map(blog => {
    const b = new Blog(blog)
    b.user = firstUser._id
    return b
  })
  const blogPromiseArray = blogObject.map(blog => blog.save())
  await Promise.all(blogPromiseArray)
  const users = await User.find({})
  const blogs = await Blog.find({})
  users.map(user => {
    user.blgs = blogs.filter(blog => blog.user.toString() === user.id).map(blog => blog.id)
    user.save()
  })
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(helper.initialBlogs.length)
  })
  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    expect(titles).toContain('React patterns')
  })

  test('property id is key', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]
      const usersAsStart = await helper.usersInDb()
      const userToView = usersAsStart.find((f) => f.id === blogToView.user.toString())
      const exBlog = {
        author: blogToView.author,
        id: blogToView.id,
        likes: blogToView.likes,
        title: blogToView.title,
        url: blogToView.url,
        user: {
          id: userToView.id,
          username: userToView.username,
          name: userToView.name
        }
      }
      const resultblog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(resultblog.body).toEqual(exBlog)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api
        .get(`/api/blogs/${validNonexistingId}`)
        .expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })

  describe('addition of a new blog', () => {
    test('a valid blogs can be added', async () => {
      const user = await helper.usersInDb()[0]
      const newBlog = {
        title: 'Why Clojure?',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2019/08/22/WhyClojure.html',
        likes: 1,
        user: user.id
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      expect(titles).toContain('Why Clojure?')

    })

    test('blog without title is not added', async () => {
      const user = await helper.usersInDb()[0]
      const newBlog = {
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2019/08/22/WhyClojure.html',
        likes: 1,
        user: user.id
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    })

    test('blog without url is not added', async () => {
      const user = await helper.usersInDb()[0]
      const newBlog = {
        title: 'Why Clojure?',
        author: 'Robert C. Martin',
        likes: 1,
        user: user.id
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    })

    test('likes is not specified, the default is 0', async () => {
      const users = await helper.usersInDb()
      const user = users[0]
      const newBlog = {
        title: 'Why won\'t it...',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2019/07/22/WhyWontIt.html',
        user: new User(user),
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
      expect(response.body.likes).toBe(0)
    })
  })

  describe('update of a blog', () => {
    test('a blog can be updated', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      blogToUpdate.title = blogToUpdate.title + 'a'
      blogToUpdate.author = blogToUpdate.author + 'b'
      blogToUpdate.url = blogToUpdate.url + 'c'
      blogToUpdate.likes = blogToUpdate.likes + 1

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)

      const updatedBlog = response.body
      expect(updatedBlog.title).toBe(blogToUpdate.title)
      expect(updatedBlog.author).toBe(blogToUpdate.author)
      expect(updatedBlog.url).toBe(blogToUpdate.url)
      expect(updatedBlog.likes).toBe(blogToUpdate.likes)
    })

    test('if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      blogToUpdate.title = blogToUpdate.title + 'a'
      blogToUpdate.author = blogToUpdate.author + 'b'
      blogToUpdate.url = blogToUpdate.url + 'c'
      blogToUpdate.likes = blogToUpdate.likes + 1

      await api
        .put(`/api/blogs/${validNonexistingId}`)
        .send(blogToUpdate)
        .expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      blogToUpdate.title = blogToUpdate.title + 'a'
      blogToUpdate.author = blogToUpdate.author + 'b'
      blogToUpdate.url = blogToUpdate.url + 'c'
      blogToUpdate.likes = blogToUpdate.likes + 1

      await api
        .put(`/api/blogs/${invalidId}`)
        .send(blogToUpdate)
        .expect(400)
    })
  })

  describe('deletion of a blog', () => {
    test('a blog can be deleted', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd.length).toBe(
        helper.initialBlogs.length - 1
      )

      const titles = blogsAtEnd.map(r => r.title)

      expect(titles).not.toContain(blogToDelete.title)
    })

    test('success if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api
        .delete(`/api/blogs/${validNonexistingId}`)
        .expect(204)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .delete(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
