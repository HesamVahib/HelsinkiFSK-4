require()
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: "HTML is easy",
    author: "Test Author 1", 
    url: "https://example.com/html",
    likes: 5
  },
  {
    title: "CSS is fun",
    author: "Test Author 2",
    url: "https://example.com/css", 
    likes: 10
  },
  {
    title: "JavaScript is powerful",
    author: "Test Author 3",
    url: "https://example.com/js",
    likes: 15
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.deepStrictEqual(response.body.length, 3)
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(e => e.title)
  assert.deepStrictEqual(contents, [
    "HTML is easy",
    "CSS is fun",
    "JavaScript is powerful"
  ])
})

test('all blogs have id property instead of _id', async () => {
  const response = await api.get('/api/blogs')


  // Check that each blog has 'id' property
  response.body.forEach(blog => {
    assert.strictEqual(typeof blog.id, 'string') // Should have 'id' property
    assert.strictEqual(blog._id, undefined)  // Should not have _id
  })
})

after(async () => {
  await mongoose.connection.close()
})