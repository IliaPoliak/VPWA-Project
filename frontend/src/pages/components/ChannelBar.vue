<template>
  <div class="channel-bar">
    <h2>Channels</h2>

    <aside class="inner-bar">
      <div class="channel-lists">
        <ul class="channel-invite">
          <li>
            <div v-bind:style="{ backgroundColor: `var(--profile-green)` }">CI</div>
            <div>Invite to new channel</div>
          </li>
        </ul>

        <ul class="channels">
          <li
            v-for="channel in CHANNELS"
            :key="channel.id"
            @click="select(channel.id)"
            :class="{ active: SELECTEDCHANNEL.id === channel.id }"
          >
            <div v-bind:style="{ backgroundColor: `var(--profile-${channel.color})` }">
              {{ getProfileText(channel.name) }}
            </div>
            <div>{{ channel.name }}</div>
          </li>
        </ul>
      </div>

      <div class="create-channel">
        <button @click="showPopup = true">Create channel</button>
      </div>

      <!-- Popup Overlay -->
      <div v-if="showPopup" class="overlay">
        <div class="popup">
          <h3>Create new channel</h3>
          <input type="text" v-model="name" placeholder="New channel name" />

          <div>
            <input type="radio" id="public" value="public" v-model="status" />
            <label for="public">public</label>
            <br />
            <input type="radio" id="private" value="private" v-model="status" />
            <label for="private">private</label>
          </div>

          <br />
          <button @click="createChannel">Submit</button>
          <button @click="showPopup = false">Cancel</button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { api } from 'boot/axios'
import {
  NICKNAME,
  SELECTEDCHANNEL,
  getProfileText,
  CHANNELS,
  selectRandomColor,
} from 'src/stores/globalStates'
import { onMounted, ref } from 'vue'
import { createWebSocket, disconnectWebSocket } from 'src/stores/ws'

onMounted(async () => {
  await loadChannels()
})

async function loadChannels() {
  try {
    const response = await api.get(`channels/${NICKNAME.value}`)
    CHANNELS.value = response.data
    select(CHANNELS.value[0].id)

    console.log(CHANNELS.value)
  } catch (err) {
    console.error('Error loading channels:', err)
  }
}

function select(channelId) {
  disconnectWebSocket()
  SELECTEDCHANNEL.value = CHANNELS.value.find((item) => item.id === channelId)

  if (SELECTEDCHANNEL.value.id) {
    createWebSocket(SELECTEDCHANNEL.value.id)
  } else {
    console.log('error connectiong websocket')
  }
}

const showPopup = ref(false)
const name = ref('')
const color = ref('red')
const status = ref('public')

async function createChannel() {
  if (!name.value.trim()) {
    alert('Please enter your name')
    return
  }
  if (!status.value) {
    alert('Please select the option')
    return
  }

  color.value = selectRandomColor()

  try {
    const payload = {
      name: name.value.trim(),
      color: color.value,
      status: status.value,
      creatorNickname: NICKNAME.value,
    }

    const response = await api.post('/channels', payload)

    if (
      response.data.status &&
      response.data.status !== 200 &&
      response.data.status !== 'public' &&
      response.data.status !== 'private'
    ) {
      alert(response.data.message)
    } else {
      console.log('Channel created:', response.data)

      // Add new channel to the list immediately
      CHANNELS.value.push(response.data)

      // Auto-select it
      select(response.data.id)
    }
  } catch (err) {
    console.error('Error creating channel:', err)
  }

  // Reset
  name.value = ''
  status.value = 'public'
  showPopup.value = false
}
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup {
  background-color: $primary-bg-1;
  padding: 20px;
  border-radius: 8px;
  min-width: 250px;
  text-align: center;
}

.popup h3 {
  margin: 0 0 15px 0;
  font-size: 1.5rem;
  text-align: center;
}

.popup input[type='text'] {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid $primary;
  background-color: #222;
  color: white;
  border-radius: 5px;
  font-size: 1rem;
  box-sizing: border-box;
}

.popup div {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  margin-bottom: 15px;
}

.popup div input[type='radio'] {
  accent-color: $primary;
  cursor: pointer;
}

.popup div label {
  font-size: 1rem;
  cursor: pointer;
}

.popup button {
  padding: 8px 16px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  background-color: $primary;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.1s ease;
}

.popup button:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

.popup button:active {
  transform: translateY(1px);
}

.popup button:last-child {
  background-color: #ccc;
  color: #333;
}

.popup button:last-child:hover {
  background-color: #b3b3b3;
}

/* --- Sidebar --- */
.channel-bar {
  width: 300px;
  color: white;
  display: flex;
  flex-direction: column;
}

.channel-bar h2 {
  margin: 0;
  padding-left: 1.2rem;
  font-size: 1.5rem;
  height: 60px;
}

.inner-bar {
  background-color: rgba(0, 0, 0, 0.4);

  flex: 1;
  overflow-y: auto;

  margin: 0;
  margin-bottom: 0.5rem;
  margin-left: 0.5rem;

  border: 1px $primary solid;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;

  position: relative; /* Makes this the reference for absolute positioning of the button */
  display: flex;
  flex-direction: column;
  height: 100%;
}

.channel-lists {
  flex: 1;
  overflow-y: auto;
}

.channel-invite {
  margin: 0 0;
  padding: 1rem;
  padding-left: 0.5rem;
  border-bottom: 1px $primary solid;
}

.channels {
  margin: 0 0;
  padding: 1rem;
  padding-left: 0.5rem;
}

li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.5rem;
  border-radius: 10px;
  transition: background-color 0.1s ease;
}

li:hover {
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.1);
}

li.active {
  background-color: $primary;
}

li div:first-child {
  height: 40px;
  width: 40px;
  border-radius: 9px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-weight: bold;
  font-size: 18px;
}

/* 
.channel-bar li:nth-child(8n + 1) div:first-child {
  background-color: var(--profile-red);
}

.channel-bar li:nth-child(8n + 2) div:first-child {
  background-color: $profile-blue;
}

.channel-bar li:nth-child(8n + 3) div:first-child {
  background-color: $profile-green;
}

.channel-bar li:nth-child(8n + 4) div:first-child {
  background-color: $profile-pink;
}

.channel-bar li:nth-child(8n + 5) div:first-child {
  background-color: $profile-orange;
}

.channel-bar li:nth-child(8n + 6) div:first-child {
  background-color: $profile-light-blue;
}

.channel-bar li:nth-child(8n + 7) div:first-child {
  background-color: $profile-yellow;
}

.channel-bar li:nth-child(8n + 8) div:first-child {
  background-color: $profile-grey;
}
  */

.create-channel {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 1rem;

  position: absolute; /* Fixed relative to .inner-bar */
  bottom: 1rem; /* distance from bottom of container */
  left: 0;
}

.create-channel button {
  background-color: rgb(0, 60, 0);
  color: white;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  padding: 0 1.2rem;
  height: 2rem;
}

.create-channel button:hover {
  background-color: rgba(0, 60, 0, 0.8);
  cursor: pointer;
}
</style>
