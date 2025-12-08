import app from '@adonisjs/core/services/app'
import server from '@adonisjs/core/services/server'
import { Server } from 'socket.io'

let io: Server | null = null

app.ready(() => {
  const nodeServer = server.getNodeServer()

  io = new Server(nodeServer, {
    cors: {
      origin: '*',
    },
  })

  console.log('[IO] Socket.IO initialized')

  io.on('connection', (socket) => {
    console.log('[IO] Client connected:', socket.id)

    socket.on('joinChannel', (channelId) => {
      socket.join(String(channelId))
      console.log(`[IO] ${socket.id} joined channel ${channelId}`)
    })

    socket.on('message', (data) => {
      const { channelId, nickname, msgText } = data

      io!.to(String(channelId)).emit('message', {
        channelId,
        nickname,
        msgText,
        timestamp: new Date().toISOString(),
      })
    })

    socket.on('disconnect', () => {
      console.log('[IO] Client disconnected:', socket.id)
    })
  })
})

export function getIO(): Server {
  if (!io) throw new Error('Socket.IO not initialized')
  return io
}
