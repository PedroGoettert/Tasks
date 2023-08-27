import {Database} from './database.js'
import {randomUUID} from 'node:crypto'
import { buildRoutePath } from './util/buildRoutePath.js'

const database = new Database()
const date = new Date().toLocaleString('pt-br', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const allTasks = database.select('tasks')
      return res.end(JSON.stringify(allTasks))
    }
  },

  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req,res) => {
      const {title, description} = req.body

      if(!title){
        return res.writeHead(400).end(JSON.stringify({message: 'É necessario um titulo'}))
      }

      if(!description){
        return res.writeHead(400).end(JSON.stringify({message: 'É necessario uma descrição'}))
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completedAt: null, 
        createdAt: date,
        updateAt: date  
      }

      database.insert('tasks', task)
      
      return res.end('added task')
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req,res) => {
      const { id } = req.params

      database.delete('tasks', id)
      return res.end('added task')
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const {id} = req.params
      const {title, description} = req.body

      if(!title && !description){
        return res.writeHead(400).end(JSON.stringify({message: 'É necessario um titulo ou uma descrição'}))
      }

      const task = {
        title,
        description,
        updateAt: date
      }

      database.update('tasks', id, task )
      return res.end('Atualizado')
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req,res) => {
      const {id} = req.params

      const updateTask = {
        completedAt: date, 
        updateAt: date
      }

      database.update('tasks', id, updateTask)

      return res.writeHead(204).end('Tarefa finalizada com sucesso')
    }
  }
]