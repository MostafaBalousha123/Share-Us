import express, { Application, NextFunction, Request, Response } from 'express'
import compression from 'compression'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import router from './routes'
import config from './config/environment'
import Websocket from './notificationSystem/serverSocket'
import NotificationSocket from './notificationSystem/notification.socket'
import { createServer } from 'http'

class App {
  public app: Application
  public nodeEnv: string

  constructor () {
    this.app = express()
    this.nodeEnv = config.nodeEnv
    this.initializeMiddlwares()
  }

  private initializeMiddlwares () {
    this.app.use(compression())
    this.app.use(express.json())
    this.app.use(cookieParser())
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(cors())
    this.app.use('/api/v1', router)
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      res.status(err.status).json({ message: err.message })
    })
  }
}

const { app } = new App()

const httpServer = createServer(app)
const io = Websocket.getInstance(httpServer)

io.initializeHandlers([
  { path: '/notifications', handler: new NotificationSocket() }
])

export default httpServer
