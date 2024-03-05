const dummy = (blogs) => {
  return 1
}

const favoriteBlog = (posts) => {
  return posts.toSorted((a, b) => b.likes - a.likes)[0]
}

const totalLikes = (posts) => {
  return posts.reduce((acc, post) => acc + post.likes, 0)
}

module.exports = {
  dummy,
  favoriteBlog,
  totalLikes
}
