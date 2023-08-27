import http from 'node:http'

import {routes} from './routes.js'
import { json } from './middleware/json.js'
import { extractQueryParms } from './util/extractQueryParams.js'


const server = http.createServer(async (req, res) => {
  const {method, url} = req

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method & route.path.test(url)
  })

  if(route){
    const routeParams = req.url.match(route.path)

    const {query, ...params} = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParms(query) : {}
      return route.handler(req, res)
  }
  return res.writeHead(404).end('not found')
})

server.listen(3333)