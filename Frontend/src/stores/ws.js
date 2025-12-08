import { ref } from 'vue'
import { io } from 'socket.io-client'
import { MESSAGES, NICKNAME } from './globalStates'

export const socket = ref(null)

export function createWebSocket(channelId) {
  // Close previous socket if exists
  if (socket.value) {
    socket.value.disconnect()
  }

  // Create socket.io connection
  socket.value = io('http://localhost:3333', {
    transports: ['websocket'],
  })

  socket.value.on('connect', () => {
    console.log('[IO] Connected:', socket.value.id)

    // Join the channel (room)
    socket.value.emit('joinChannel', channelId)
  })

  // Receive broadcast message
  socket.value.on('message', (data) => {
    console.log('[IO] message received:', data)
    MESSAGES.value.push(data)
  })

  socket.value.on('disconnect', () => {
    console.log('[IO] disconnected')
  })
}

export function disconnectWebSocket() {
  if (socket.value) {
    socket.value.disconnect()
    socket.value = null
  }
}

export function sendWSMessage(channelId, msgText) {
  if (!socket.value) return console.error('Socket not connected')

  socket.value.emit('message', {
    channelId,
    nickname: NICKNAME.value,
    msgText,
  })
}
