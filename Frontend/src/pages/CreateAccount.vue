<template>
  <div v-if="isLoggedIn" class="flex-container">
    <div class="card">
      <p class="message">You are already logged in!</p>
      <router-link to="/" class="link-button">Go to the main page</router-link>
    </div>
  </div>

  <div v-else class="flex-container">
    <div class="card">
      <h2>Sign Up</h2>

      <form v-on:submit.prevent="handleSubmit" class="form">
        <input v-model="name" type="text" placeholder="Name" required />

        <input v-model="surname" type="text" placeholder="Surname" required />

        <input v-model="nickname" type="text" placeholder="Nickname" required />

        <input v-model="email" type="email" placeholder="Email" required />

        <input v-model="password" type="password" placeholder="Password" required />

        <input v-model="confirmPassword" type="password" placeholder="Confirm Password" required />

        <button type="submit" class="submit-button">Sign Up</button>
      </form>

      <p class="footer-text">
        Already have an account? <router-link to="/signin" class="footer-link">Sign in</router-link>
      </p>
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

const router = useRouter()

function handleSubmit() {
  if (password.value === confirmPassword.value) {
    isLoggedIn.value = true
    router.push('/')
  } else {
    alert("Passwords don't match")
  }
}
</script>

<style lang="scss" scoped>
@import 'src/css/auth.scss';
</style>
