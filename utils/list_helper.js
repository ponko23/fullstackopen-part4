const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) =>  _.sumBy(blogs, 'likes')

const favoriteBlog = (blogs) => {
  if(blogs.length === 0) return null
  const favorite = _.maxBy(blogs, 'likes')
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  const g = _.groupBy(blogs, 'author')
  const m = _.map(g, function(v, k) { return { author: k, blogs: v.length }})
  return _.maxBy(m, 'blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  const g = _.groupBy(blogs, 'author')
  const m = _.map(g, function(v, k) { return { author: k, likes: _.sumBy(v, 'likes') }})
  return _.maxBy(m, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
