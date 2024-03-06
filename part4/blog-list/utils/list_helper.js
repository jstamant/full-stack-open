const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const favoriteBlog = (posts) => {
  return posts.toSorted((a, b) => b.likes - a.likes)[0]
}

const mostBlogs = (posts) => {
  const authors = lodash.countBy(posts, 'author')
  const blogCounts = []
  lodash.forIn(authors, (val, key) => {
    blogCounts.push({ author: key, blogs: val })
  })
  return blogCounts.toSorted((a, b) => b.blogs - a.blogs)[0]
}

const mostLikes = (posts) => {
  if (lodash.isEmpty(posts)) return undefined
  const authorLikes = posts.reduce((acc, post) => {
    acc[post.author] = post.author in acc
      ? acc[post.author] + post.likes
      : post.likes
    return acc
  }, {})
  let mostLiked = {}
  lodash.forIn(authorLikes, (likes, key) => {
    if (likes > (mostLiked.likes || -1))
      mostLiked = { author: key, likes }
  })
  return mostLiked
}

const totalLikes = (posts) => {
  return posts.reduce((acc, post) => acc + post.likes, 0)
}

module.exports = {
  dummy,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  totalLikes
}
