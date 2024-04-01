<script setup lang="ts">
import {useAppStore} from '@/stores/app';

const store = useAppStore();
</script>

<template>
  <Transition name="slide">
    <div class="p-4 bg-gray-100 w-64 flex flex-col" v-if="store.isSidebarVisible">
      <ul class="overflow-auto">
        <li>Menu Item 1</li>
        <li>Menu Item 2</li>
      </ul>
    </div>
  </Transition>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform .5s ease;
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-enter-to {
  transform: translateX(0);
}
.slide-leave-from {
  transform: translateX(0);
}
.slide-leave-to {
  transform: translateX(-100%);
}
</style>