import { ref } from 'vue'
import { io } from 'socket.io-client'
import { MESSAGES, CHANNELS, NICKNAME, SELECTEDCHANNEL } from './globalStates'

export const socket = ref(null)

export function initWebSocket() {
  if(socket.value)
    return

  // Create socket.io connection
  socket.value = io('http://localhost:3333', {
    transports: ['websocket'],
  })

  socket.value.on('connect', () => {
    console.log('[WS] Connected:', socket.value.id)

    // Join the channel (room)
    //*
    if(SELECTEDCHANNEL.value?.id){
      joinChannel(SELECTEDCHANNEL.value.id)
    }
  })

  // Global event listener - type-data
  socket.value.on('event', (packet) => {
    const {type, data} = packet
    handleEvent(type, data)
  })

  socket.value.on('disconnect', () => {
    console.log('[WS] Disconnected')
    //* socket.value.disconnect()   // disconnect from socket instead of destroying
  })
}

function handleEvent(type, data){
  switch(type){
    case 'message':
      if(data.channelId === SELECTEDCHANNEL.value?.id)
        MESSAGES.value.push(data) // save the newly sent message locally
      break

    case 'typing':
      console.log('[WS] typing: ', data)
      // TODO typingStore.update ...
      break

    case 'statusUpdate':
      console.log('[WS] user status update: ', data)
      break

    case 'channelUpdate':
      console.log('[WS] channel updated: ', data)
      handleChannelUpdate(data) // handle specific type of channel update
      break
    
    case 'error':
      console.log('[WS] server error: ', data.message)
      break

    default:
      console.warn('[WS] Unknown event type: ', type, data)
  }
}

export function joinChannel(channelId){
  if(!socket.value)
    return

  socket.value.emit('event', {
    type: 'joinChannel',
    data: {channelId}
  })

  console.log('[WS] joined channel: ', channelId)
}


export function sendWSMessage(msgText) {
console.log('currently sending message: ', msgText)

  if (!socket.value) 
    return console.error('Socket not connected')
  
  if(!SELECTEDCHANNEL.value)
    return console.error('No selected channel')

  let channelId = SELECTEDCHANNEL.value.id
  let nickname = NICKNAME.value

  // broadcast a 'sendMessage' event to the socket
  socket.value.emit('event', {
    type: 'sendMessage',
    data: {channelId, nickname, msgText}
  })
}

export function sendTyping(text){
  if(!socket.value || !SELECTEDCHANNEL.value)
    return

  let channelId = SELECTEDCHANNEL.value.id
  let nickname = NICKNAME.value

  // broadcast a 'typing' event to the socket
  socket.value.emit('event', {
    type: 'typing',
    data: {channelId, nickname, text}
  })
}

export function updateStatus(status){
  if(!socket.value)
    return

  let nickname = NICKNAME.value

  // broadcast a 'statusUpdate' event to the socket
  socket.value.emit('event', {
    type: 'statusUpdate',
    data: {nickname, status} 
  })
}

function handleChannelUpdate(data){
  const {action, channelId, nickname} = data

  switch(action){
    case 'joined':
      console.log('[WS] User joined channel: ', nickname)
      break

    case 'left':
      console.log('[WS] User left: ', nickname)
      break

    case 'deleted':
      // remove channelId from local channel storage 
      CHANNELS.value = CHANNELS.value.filter(ch => ch.id !== channelId)
      break

    case 'invited':
      // fetch channel list and push new channel
      console.log('[WS] Channel update: invite')
      break

    case 'kicked':
      // TODO refine kicking logic
      
      // empty selected channel and messages
      if(SELECTEDCHANNEL.value?.id === channelId){
        SELECTEDCHANNEL.value = null
        MESSAGES.value = []
      }

      // remove channel from channel list 
      CHANNELS.value = CHANNELS.value.filter(ch => ch.id !== channelId)
      break
    }



    console.log('[WS] Channel update applied: ', action)
}