import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useAppStore = defineStore('app', () => {
  const isSidebarVisible = ref(true);
  const isAboutVisible = ref(false);

  function toggleSidebar() {
    isSidebarVisible.value = !isSidebarVisible.value;
  }

  function showAbout() {
    isAboutVisible.value = true;
  }

  function hideAbout() {
    isAboutVisible.value = false;
  }

  return {
    isSidebarVisible,
    isAboutVisible,
    toggleSidebar,
    showAbout,
    hideAbout
  };
});