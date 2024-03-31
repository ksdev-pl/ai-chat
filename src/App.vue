<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <div class="wrapper">
      <div class="text-center mb-20">
        <h1 class="text-4xl font-bold text-blue-500">Hello, Tailwind!</h1>
        <p class="text-amber-700">This is a vue app styled with TailwindCSS.</p>
      </div>

      <HelloWorld msg="You did it!" />
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>

</style>
