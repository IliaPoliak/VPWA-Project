import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createChannel } from 'src/models/Channel'

export const useChannelStore = defineStore('channel', () => {
  const channels = ref([])

  function loadChannels() {
    channels.value = [
      createChannel({
        id: 'C1',
        ownerId: 'test_user1',
        name: 'TestChannel1',
        type: 'public',
        color: 'blue',
        members: ['test_user1'],
        messages: ['test_message1']
      }),
      createChannel({
        id: 'C2',
        ownerId: 'test_user1',
        name: 'TestChannel2',
        type: 'public',
        color: 'red',
        members: ['test_user1'],
        messages: []
      })
    ]
  }
  return { channels, loadChannels }
})