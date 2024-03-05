const dummy = (blogs) => {
  return 1
}

const totalLikes = (posts) => {
  return posts.reduce((acc, post) => acc + post.likes, 0)
}

module.exports = {
  dummy,
  totalLikes
}
