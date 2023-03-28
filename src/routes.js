import { randomUUID } from 'node:crypto'
import { buildRoutePath } from './utils/build-route-path.js'
import { DataBase } from './database.js'

const database = new DataBase()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title?.trim()) {
        return res.writeHead(400).end(JSON.stringify({ 
          error: 'Task title is required.' 
        }))
      }

      if (!description?.trim()) {
        return res.writeHead(400).end(JSON.stringify({ 
          error: 'Task description is required.' 
        }))
      }

      const currentTime = new Date().toISOString()

      const task = {
        id: randomUUID(),
        title: title.trim(),
        description: description.trim(),
        completed_at: null,
        created_at: currentTime,
        updated_at: currentTime,
      }

      database.insert('tasks', task)

      res.writeHead(201).end()
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', null, search ? {
        title: search,
        description: search,
      } : null)

      res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const task = database.select('tasks', id)

      if (!task) {
        return res.writeHead(400).end(JSON.stringify({ 
          error: 'Task ID is not exist.' 
        }))
      }

      if (!title?.trim() && !description?.trim()) {
        return res.writeHead(400).end(JSON.stringify({ 
          error: 'Send at least title or description of task.' 
        }))
      }

      database.update('tasks', id, {
        title: title?.trim() ? title.trim() : task.title,
        description: description?.trim() ? description.trim() : task.description,
        updated_at: new Date().toISOString(),
      })

      res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const task = database.select('tasks', id)

      if (!task) {
        return res.writeHead(400).end(JSON.stringify({ 
          error: 'Task ID is not exist.' 
        }))
      }

      database.delete('tasks', id)

      res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const task = database.select('tasks', id)

      if (!task) {
        return res.writeHead(400).end(JSON.stringify({ 
          error: 'Task ID is not exist.' 
        }))
      }

      const currentTime = new Date().toISOString()

      const isCompletedTask = !!task.completed_at

      database.update('tasks', id, {
        completed_at: isCompletedTask ? null : currentTime,
        updated_at: currentTime,
      })

      res.writeHead(204).end()
    }
  },
]