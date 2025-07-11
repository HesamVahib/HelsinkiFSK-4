const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {

  const blogs = await Blog.find({})
  if (!blogs) {
    return response.status(404).json({ error: 'No blogs found' })
  }
  return response.status(200).json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    content: body.content,
    important: body.important || false
  })

  const result = await blog.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter
