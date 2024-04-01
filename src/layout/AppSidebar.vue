<script setup lang="ts">
import {useAppStore} from '@/stores/app';

const store = useAppStore();
</script>

<template>
  <div class="p-4 bg-gray-100 w-64 flex flex-col text-gray-500" v-if="store.isSidebarVisible">
    <ul class="overflow-auto">
      <li><a href="#" class="hover:text-blue-600">Menu Item 1</a></li>
      <li><a href="#" class="hover:text-blue-600">Menu Item 2</a></li>
    </ul>
  </div>
</template>