<script setup lang="ts">
  import {useAppStore} from '@/stores/app.store';
  import {Bars3Icon} from '@heroicons/vue/24/outline';
  import {Cog6ToothIcon} from '@heroicons/vue/24/outline';
  import {useSettingsStore} from '@/stores/settings.store';

  const appStore = useAppStore();
  const settingsStore = useSettingsStore();
</script>

<template>
  <div class="p-2 bg-gray-200 flex justify-between">
    <Bars3Icon class="h-6 w-6 text-gray-500 cursor-pointer hover:text-blue-600" @click="appStore.toggleSidebar()"></Bars3Icon>
    <Cog6ToothIcon class="h-6 w-6 text-gray-500 cursor-pointer hover:text-blue-600" @click="settingsStore.showSettings()"></Cog6ToothIcon>
  </div>
</template>
