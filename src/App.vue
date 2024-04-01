<script setup lang="ts">
import LayoutSidebar from '@/layout/AppSidebar.vue';
import LayoutContents from '@/layout/AppContents.vue';
import LayoutHeader from '@/layout/AppHeader.vue';
</script>

<template>
  <div class="flex flex-col h-screen bg-white">
    <LayoutHeader/>
    <div class="flex flex-1 overflow-hidden">
      <LayoutSidebar/>
      <LayoutContents/>
    </div>
  </div>
</template>