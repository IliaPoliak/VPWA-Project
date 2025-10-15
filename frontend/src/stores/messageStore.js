import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createMessage } from 'src/models/Message'

export const useMessageStore = defineStore('message', () => {
  const messages = ref([])

  function loadMessages() {
    messages.value = [
      createMessage({
        id: 'test_message1',
        senderId: 'test_user1',
        channelId: 'test_channel1',
        text: 'This is a sample text.',
        timestamp: '2025-10-15T23:37:18Z',
        recipientId: null
      })
    ]
  }
  return { messages, loadMessages }
})