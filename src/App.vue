<script setup lang="ts">
import LayoutSidebar from '@/layout/LayoutSidebar.vue';
import LayoutContents from '@/layout/LayoutContents.vue';
import LayoutHeader from '@/layout/LayoutHeader.vue';
</script>

<template>
  <div class="flex flex-col h-screen bg-black text-white">
    <LayoutHeader/>
    <div class="flex flex-1 overflow-hidden">
      <LayoutSidebar/>
      <LayoutContents/>
    </div>
  </div>
</template>