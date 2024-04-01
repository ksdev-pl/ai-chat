import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useAppStore = defineStore('app', () => {
  const isSidebarVisible = ref(true);

  function toggleSidebar() {
    isSidebarVisible.value = !isSidebarVisible.value;
  }

  return {isSidebarVisible, toggleSidebar};
});