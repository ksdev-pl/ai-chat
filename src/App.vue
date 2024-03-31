<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
</script>

<template>
  <header>
    <div>
      <div class="text-center mb-20">
        <h1 class="text-4xl font-bold text-blue-500">Hello, Tailwind!</h1>
        <p class="text-amber-700">This is a vue app styled with TailwindCSS.</p>
      </div>

      <HelloWorld msg="You did it!" />
      <ul>
        <li><RouterLink to="/">Home</RouterLink></li>
        <li><RouterLink to="/about">About</RouterLink></li>
      </ul>
    </div>
  </header>

  <RouterView />
</template>