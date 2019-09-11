const listHelper = require('../utils/list_helper')
const zeroBlog = []
const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]
const listWithFiveBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]
const listWithSameLikesBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
]

test('dummy returns one', () => {
  expect(listHelper.dummy(zeroBlog)).toBe(1)
})

describe('total likes', () => {
  test('when list has only one blog equals the likes of that', () => {
    expect(listHelper.totalLikes(listWithOneBlog)).toBe(5)
  })

  test('when list has 5 blogs equals then likes of that', () => {
    expect(listHelper.totalLikes(listWithFiveBlogs)).toBe(36)
  })

  test('when list has no blog equals then likes of that', () => {
    expect(listHelper.totalLikes(zeroBlog)).toBe(0)
  })
})

describe('most favorite blog', () => {
  const getCurrent = (blogs, i) => {
    return {
      title: blogs[i].title,
      author: blogs[i].author,
      likes: blogs[i].likes
    }
  }
  test('when list has only one blog equals the likes of that', () => {
    expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual(getCurrent(listWithOneBlog, 0))
  })

  test('when list has 5 blogs equals then likes of that', () => {
    expect(listHelper.favoriteBlog(listWithFiveBlogs)).toEqual(getCurrent(listWithFiveBlogs, 2))
  })

  test('when list has no blog equals then likes of that', () => {
    expect(listHelper.favoriteBlog(zeroBlog)).toEqual(null)
  })

  test('If the list contains 2 blogs of the same liks', () => {
    expect(listHelper.favoriteBlog(listWithSameLikesBlogs)).toEqual(getCurrent(listWithSameLikesBlogs, 0))
  })
})

describe('most blogs author', () => {
  test('when list has only one blog equals the likes of that', () => {
    expect(listHelper.mostBlogs(listWithOneBlog))
      .toEqual({
        author: 'Edsger W. Dijkstra',
        blogs: 1,
      })
  })

  test('when list has 5 blogs equals then likes of that', () => {
    expect(listHelper.mostBlogs(listWithFiveBlogs))
      .toEqual({
        author: 'Robert C. Martin',
        blogs: 3,
      })
  })

  test('when list has no blog equals then likes of that', () => {
    expect(listHelper.mostBlogs(zeroBlog)).toEqual(null)
  })

  test('If the list contains 2 blogs of the same liks', () => {
    expect(listHelper.mostBlogs(listWithSameLikesBlogs))
      .toEqual({
        author: 'Michael Chan',
        blogs: 1,
      })
  })
})

describe('most likes author', () => {
  test('when list has only one blog equals the likes of that', () => {
    expect(listHelper.mostLikes(listWithOneBlog))
      .toEqual({
        author: 'Edsger W. Dijkstra',
        likes: 5,
      })
  })

  test('when list has 5 blogs equals then likes of that', () => {
    expect(listHelper.mostLikes(listWithFiveBlogs))
      .toEqual({
        author: 'Edsger W. Dijkstra',
        likes: 17,
      })
  })

  test('when list has no blog equals then likes of that', () => {
    expect(listHelper.mostLikes(zeroBlog)).toEqual(null)
  })

  test('If the list contains 2 blogs of the same liks', () => {
    expect(listHelper.mostLikes(listWithSameLikesBlogs))
      .toEqual({
        author: 'Michael Chan',
        likes: 5,
      })
  })
})
