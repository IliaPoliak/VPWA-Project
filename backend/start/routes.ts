/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

import Channel from '#models/channel'
import ChannelUser from '#models/channel_user'
import Message from '#models/message'
import User from '#models/user'

import AuthController from '#controllers/auth_controller'
import ChannelsController from '#controllers/channel_controller'


const authController = new AuthController()

/* --- /auth --- */
router
  .group(() => {
    router.post('/register', authController.register.bind(authController))
    router.post('/login', authController.login.bind(authController))
    router.post('/logout', authController.logout.bind(authController)).use(middleware.auth())
  })
  .prefix('/auth')

/* --- /channels --- */
router
  .group(() => {
    router.get('get_channels/:nickname', [ChannelsController, 'listForUser']) // GET '/channels/get_channels/:nickname' -> get user's channel list
    router.get('get_users/:channelId', [ChannelsController, 'listUsers'])     // GET '/channels/get_users/:channelId' -> get the list of users in the channel
    router.get('/status/:channelId', [ChannelsController, 'status'])          // GET '/channels/status/:channelId'-> get channel status by channel id

    router.post('/', [ChannelsController, 'create'])        // POST '/channels' -> create a new channel    
    router.post('/join', [ChannelsController, 'join'])      // POST '/channels/join -> ChannelsController.join()
    router.post('/invite', [ChannelsController, 'invite'])  // POST '/channels/invite' -> Invite user to the channel

    router.delete('/', [ChannelsController, 'leave'])   // DELETE '/channels' -> Leave channel
  })
  .prefix('/channels')

/* --- /messages --- */
router
  .group(() => {
    // GET messages by chanelId
    router.get('/:channelId', async ({params}) => {
      const channelId = Number(params.channelId)

      if(!channelId || isNaN(channelId))
        return []

      const list = await Message
        .query()
        .where('channelId', channelId)
        .preload('user')
        .orderBy('created_at', 'asc')

      console.warn('messages', list)

      let messages = list.map(msg => ({
        id: msg.id,
        channelId: msg.channelId,
        nickname: msg.user.nickname,
        msgText: msg.msgText,
        profileColor: msg.user.profileColor,
        timestamp: msg.createdAt
      }))
      
      console.log('messages i need', messages)
      return messages
    })

    // POST new message
    router.post('/', async ({ request }) => {
      const { nickname, channel_id, msg_text} = request.only([
        'nickname',
        'channel_id',
        'msg_text'
      ])

      // Find user by nickname
      const user = await User.query().where('nickname', nickname).firstOrFail()

      // Create message
      const message = await Message.create({
        userId: user.id,
        channelId: channel_id,
        msgText: msg_text
      })

      return message
    })
  })
  .prefix('/messages')

/* Web Socket */
const channelClients: Record<string, Set<any>> = {} // all web socket connections to that channel
/*
router.ws('/channels/:channelId', ({ ws, params }) => {
  const channelId = params.channelId

  // Initialize the set for this channel
  if (!channelClients[channelId]) {
    channelClients[channelId] = new Set()
  }
  channelClients[channelId].add(ws)

  // Log client connection
  console.log(
    `[WS] Client connected to channel ${channelId}. Total clients: ${channelClients[channelId].size}`
  )

  // Send welcome to the new client
  //ws.send(JSON.stringify({ system: true, message: `Connected to channel ${channelId}` }))

  // Handle incoming messages
  ws.on('message', (msg: string) => {
    const payload = JSON.parse(msg)

    // Broadcast to all clients in this channel
    for (const client of channelClients[channelId]) {
      if (client !== ws) {
        // skip sender
        client.send(
          JSON.stringify({
            channelId,
            nickname: payload.nickname,
            msgText: payload.msgText,
            timestamp: new Date().toISOString(),
          })
        )
        console.log(`brodcasting message ${JSON.stringify(payload)}`)
      }
    }
  })

  // Handle client disconnect
  ws.on('close', () => {
    channelClients[channelId].delete(ws)
    console.log(
      `[WS] Client disconnected from channel ${channelId}. Remaining clients: ${channelClients[channelId].size}`
    )
  })
})
*/
