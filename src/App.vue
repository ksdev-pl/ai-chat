<script setup lang="ts">
  import AppSidebar from '@/components/AppSidebar.vue';
  import AppContents from '@/components/AppContents.vue';
  import AppHeader from '@/components/AppHeader.vue';
  import AppOptions from '@/components/AppSettings.vue';
</script>

<template>
  <div class="flex flex-col h-screen bg-white">
    <AppHeader/>
    <div class="flex flex-1 overflow-hidden">
      <AppSidebar/>
      <AppContents/>
    </div>
  </div>
  <AppOptions></AppOptions>
</template>