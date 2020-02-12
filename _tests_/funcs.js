import { getAllPosts } from '../src/server/services'

const functions = {
  getPosts: () => new Promise(resolve => getAllPosts().then(res => resolve(res)))
}

module.exports = functions;