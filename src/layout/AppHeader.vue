<script setup lang="ts">
import {useAppStore} from '@/stores/app';

const store = useAppStore();
</script>

<template>
  <div class="p-4 bg-gray-200">
    <button type="button" @click="store.toggleSidebar()">&#9776;</button>
  </div>
</template>
