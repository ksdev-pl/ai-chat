<script setup lang="ts">
import {useAppStore} from '@/stores/app';
import {Bars3Icon} from '@heroicons/vue/24/outline';
import {Cog6ToothIcon} from '@heroicons/vue/24/outline';

const store = useAppStore();
</script>

<template>
  <div class="p-2 bg-gray-200 flex justify-between">
    <Bars3Icon class="h-6 w-6 text-gray-500 cursor-pointer hover:text-blue-600" @click="store.toggleSidebar()"></Bars3Icon>
    <Cog6ToothIcon class="h-6 w-6 text-gray-500 cursor-pointer hover:text-blue-600"></Cog6ToothIcon>
  </div>
</template>
