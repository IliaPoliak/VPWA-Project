<template>
  <div v-if="isLoggedIn" class="layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h2>Chanels</h2>
      <ul>
        <li>
          <div>C1</div>
          <div>Chanel 1</div>
        </li>
        <li>
          <div>C2</div>
          <div>Chanel 2</div>
        </li>
        <li>
          <div>C3</div>
          <div>Chanel 3</div>
        </li>
        <li>
          <div>C4</div>
          <div>Chanel 4</div>
        </li>
        <li>
          <div>C5</div>
          <div>Chanel 5</div>
        </li>
        <li>
          <div>C6</div>
          <div>Chanel 6</div>
        </li>
        <li>
          <div>C7</div>
          <div>Chanel 7</div>
        </li>
        <li>
          <div>C8</div>
          <div>Chanel 8</div>
        </li>
        <li>
          <div>C9</div>
          <div>Chanel 9</div>
        </li>
        <li>
          <div>C10</div>
          <div>Chanel 10</div>
        </li>
        <li>
          <div>C10</div>
          <div>Chanel 10</div>
        </li>
        <li>
          <div>C10</div>
          <div>Chanel 10</div>
        </li>
        <li>
          <div>C10</div>
          <div>Chanel 10</div>
        </li>
        <li>
          <div>C10</div>
          <div>Chanel 10</div>
        </li>
        <li>
          <div>C10</div>
          <div>Chanel 10</div>
        </li>
        <li>
          <div>C10</div>
          <div>Chanel 10</div>
        </li>
        <li>
          <div>C10</div>
          <div>Chanel 10</div>
        </li>
      </ul>
    </aside>

    <!-- Main area -->
    <div class="main">
      <!-- Top bar -->
      <header class="top-bar">
        <div></div>
        <div class="top-bar-right">
          <div v-bind:title="`${name} ${surname} | ${nickname} | ${email}`">
            Logged in: {{ nickname }}
          </div>
          <button v-on:click="logOut">Log Out</button>
        </div>
      </header>

      <!-- Chat / content area -->
      <div class="content">
        <div class="messages">
          <p>Jot your thoughts below.</p>
          <p>Welcome, {{ nickname }}!</p>
        </div>

        <!-- Fixed input at bottom -->
        <div class="input-container">
          <textarea
            rows="1"
            placeholder="Type your message here..."
            ref="autoResize"
            v-model="message"
            v-on:input="resizeTextarea"
          ></textarea>
          <button>Send</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  isLoggedIn,
  name,
  surname,
  nickname,
  email,
  password,
  confirmPassword,
} from 'src/stores/globalStates'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()

const message = ref('')

// Redirect if not signed in
if (isLoggedIn.value === false) {
  router.push('/signin')
}

// Handle automatic resizing of a message field
const autoResize = ref(null)
function resizeTextarea() {
  const el = autoResize.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}
onMounted(() => {
  resizeTextarea() // run it when component is mounted to set the initial height
})

// Handle log out
const logOut = () => {
  isLoggedIn.value = false
  name.value = ''
  surname.value = ''
  nickname.value = ''
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  router.push('/signin')
}
</script>

<style lang="scss" scoped>
/* --- Layout --- */
.layout {
  display: flex;
  height: 100vh;
  background: radial-gradient(circle at top left, $primary-bg-1, $primary-bg-2);
}

/* --- Sidebar --- */
.sidebar {
  width: 350px;
  color: white;
  margin: 0;
  padding: 0;
}

.sidebar h2 {
  margin: 0;
  padding: 0 1rem;
  font-size: 1.5rem;
  height: 9vh;
}

.sidebar ul {
  height: 90vh;
  overflow-y: auto;
  list-style: none;
  padding: 0 1rem;
  margin: 0;
}

.sidebar li {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.5rem;
  border-radius: 10px;
  transition: background-color 0.1s ease;
}

.sidebar li:hover {
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar li div:first-child {
  height: 35px;
  width: 35px;
  border-radius: 9px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 17px;
}

.sidebar li:nth-child(7n + 1) div:first-child {
  background-color: $chanel0;
}

.sidebar li:nth-child(7n + 2) div:first-child {
  background-color: $chanel1;
}

.sidebar li:nth-child(7n + 3) div:first-child {
  background-color: $chanel2;
}

.sidebar li:nth-child(7n + 4) div:first-child {
  background-color: $chanel3;
}

.sidebar li:nth-child(7n + 5) div:first-child {
  background-color: $chanel4;
}

.sidebar li:nth-child(7n + 6) div:first-child {
  background-color: $chanel5;
}

.sidebar li:nth-child(7n + 7) div:first-child {
  background-color: $chanel6;
}

.sidebar li div:nth-child(2) {
}

/* --- Main area --- */
.main {
  height: 99%;
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
}

/* --- Top bar --- */
.top-bar {
  height: 60px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  flex-shrink: 0;
}

.top-bar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.top-bar-right button {
  border: none;
  color: white;
  border-radius: 50px;
  background-color: transparent;
  width: 75px;
  height: 35px;
  text-decoration: underline;

  transition:
    background-color 0.15s ease,
    font-size 0.15s ease,
    font-weight 0.15s ease;
}

.top-bar-right button:hover {
  font-size: 16px;
  background-color: rgba(255, 255, 255, 0.1);
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
}

/* --- Content area --- */
.content {
  width: 99.4%;
  border-radius: 0.2rem;
  border: 1px &primary solid;
  background: #333;
  color: #ccc;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  overflow: hidden;
}

.messages {
  margin-bottom: 1rem;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
}

/* --- Input container --- */
.input-container {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 0;
  flex-shrink: 0;
}

.input-container textarea {
  overflow-y: hidden; /* hide scrollbar */
  resize: none;
  flex: 1;
  padding: 0.6rem 0.8rem;
  border-radius: 10px;
  border: 1px solid #777;
  background-color: #444;
  color: #eee;
  max-height: 40vh;
}

.input-container textarea:focus {
  border-color: #aaa;
}

.input-container button {
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  border: none;
  background-color: #1976d2;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.input-container button:hover {
  background-color: #1565c0;
}
</style>
