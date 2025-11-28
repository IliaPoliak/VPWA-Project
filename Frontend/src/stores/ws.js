import { ref } from 'vue'
import { MESSAGES } from './globalStates'
//import { MESSAGES } from './globalStates'

export const WS_CONNECTION = ref(null)

export function createWebSocket(channelId) {
  if (WS_CONNECTION.value) {
    WS_CONNECTION.value.close()
  }

  WS_CONNECTION.value = new WebSocket(`ws://localhost:3333/channels/${channelId}`)

  WS_CONNECTION.value.onopen = () => {
    console.log('WS connected to channel', channelId)
  }

  WS_CONNECTION.value.onmessage = (event) => {
    const data = JSON.parse(event.data)
    console.log('Incoming WS message:', data)

    if (data && data.channelId && data.msgText) {
      MESSAGES.value.push(data)
    }
  }

  WS_CONNECTION.value.onclose = () => {
    console.log('WS disconnected')
  }

  return WS_CONNECTION.value
}

export function disconnectWebSocket() {
  if (WS_CONNECTION.value) {
    WS_CONNECTION.value.close()
    WS_CONNECTION.value = null
  }
}

export function sendWSMessage(obj) {
  if (!WS_CONNECTION.value) return console.error('WS not connected')
  WS_CONNECTION.value.send(JSON.stringify(obj))
  console.log(`brodecasting message: ${JSON.stringify(obj)}`)
}
