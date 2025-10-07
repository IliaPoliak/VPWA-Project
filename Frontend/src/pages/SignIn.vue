<template>
  <div class="page">
    <div v-if="isLoggedIn" class="flex-container">
      <div class="card">
        <p class="message">You are already logged in!</p>
        <router-link to="/" class="link-button">Go to the main page</router-link>
      </div>
    </div>

    <div v-else class="flex-container">
      <div class="card">
        <h2>Sign In</h2>

        <form v-on:submit.prevent="handleSubmit" class="form">
          <input v-model="nickname" type="text" placeholder="Nickname" required />

          <input v-model="password" type="password" placeholder="Password" required />

          <button type="submit" class="submit-button">Sign In</button>
        </form>

        <p class="footer-text">
          Don’t have an account? <router-link to="/create" class="footer-link">Sign up</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { isLoggedIn, nickname, password } from 'src/stores/globalStates'
import { useRouter } from 'vue-router'

const router = useRouter()

function handleSubmit() {
  isLoggedIn.value = true
  router.push('/')
}
</script>

<style lang="scss" scoped>
@import 'src/css/auth.scss';

.page {
  min-height: 100vh;
  background: $auth-background;
}

.flex-container {
  min-height: 85vh;
}
</style>
