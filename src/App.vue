<script setup lang="ts">
import AppSidebar from '@/layout/AppSidebar.vue';
import AppContents from '@/layout/AppContents.vue';
import AppHeader from '@/layout/AppHeader.vue';
</script>

<template>
  <div class="flex flex-col h-screen bg-white">
    <AppHeader/>
    <div class="flex flex-1 overflow-hidden">
      <AppSidebar/>
      <AppContents/>
    </div>
  </div>
</template>