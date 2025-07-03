import path from 'path'
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'

import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from '../src/user/user.routes.js'
import publicationRouter from '../src/publication/publication.routes.js'
import institutionRoutes from '../src/institution/institution.routes.js'
import donationRoutes from '../src/donation/donation.routes.js'
import commentRoutes from '../src/comment/comment.routes.js'
import notificationRoutes from '../src/notification/notification.routes.js'
import reportRoutes from '../src/excel/report.routes.js'
import { limiter } from '../middlewares/rate.limit.js'
import { deleteFileOnError } from '../middlewares/delete.file.on.errors.js'
import { defaultAdmin } from '../src/user/user.controller.js'

const configs = (app) => {
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }))

  app.use(helmet())
  app.use(morgan('dev'))
  app.use(limiter)

  app.use('/uploads/img/users', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
    next()
  }, express.static(path.join(process.cwd(), 'uploads/img/users')))
}

const routes = (app) => {
  app.use(authRoutes)
  app.use('/v1/user', userRoutes)
  app.use('/v1/publication', publicationRouter)
  app.use('/v1/institution', institutionRoutes)
  app.use('/v1/donation', donationRoutes)
  app.use('/v1/comment', commentRoutes)
  app.use('/v1/notification', notificationRoutes)
  app.use('/v1', reportRoutes)
  app.use(deleteFileOnError)
}

export const initServer = () => {
  const app = express()
  try {
    configs(app)
    routes(app)

    // socket.io integrado
    const server = http.createServer(app)

    const io = new Server(server, {
      cors: {
        origin: 'http://localhost:5173',
        credentials: true,
      }
    })

    io.on('connection', (socket) => {
      console.log('Socket conectado:', socket.id)

      socket.on('disconnect', () => {
        console.log('Socket desconectado:', socket.id)
      })
    })

    // guardar el io para accederlo en los controladores
    app.set('io', io)

    server.listen(process.env.PORT || 3200)
    console.log(`Server running on port: ${process.env.PORT || 3200}`)

    defaultAdmin('Gabriel', 'Pinula', '1pinula', 'pinula@gmail.com', '123123Aa!', 'ADMIN')

  } catch (err) {
    console.error('Server init failed', err)
  }
}
