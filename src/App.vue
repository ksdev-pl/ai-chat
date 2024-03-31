<script setup lang="ts"></script>

<template>
  <div class="flex flex-col h-screen bg-black text-white">

    <!-- Header -->
    <div class="p-4 bg-gray-900">
      Header
    </div>

    <!-- Content -->
    <div class="flex flex-1 overflow-hidden">

      <!-- Sidebar -->
      <div class="p-4 bg-gray-800 w-64 flex flex-col">
        <ul class="overflow-auto">
          <li>Menu Item 1</li>
          <li>Menu Item 2</li>
          <!-- Repeat for as many menu items. -->
        </ul>
      </div>

      <!-- Main Contents -->
      <main class="flex-1 p-4 overflow-auto">
        Your contents go here.
      </main>

    </div>

  </div>

<!--  <RouterLink to="/">Home</RouterLink>-->
<!--  <RouterLink to="/about">About</RouterLink>-->
<!--  -->
<!--  <RouterView />-->
</template>