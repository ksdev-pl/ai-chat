import {defineStore} from 'pinia';
import {ref} from 'vue';
import {v4 as uuidv4} from 'uuid';

export const useAppStore = defineStore('app', () => {
  const isSidebarVisible = ref(true);
  const isAboutVisible = ref(false);
  const errors = ref<{id: string, message: string}[]>([]);

  function toggleSidebar() {
    isSidebarVisible.value = !isSidebarVisible.value;
  }

  function showAbout() {
    isAboutVisible.value = true;
  }

  function hideAbout() {
    isAboutVisible.value = false;
  }

  function addError(error: string) {
    errors.value.push({id: uuidv4(), message: error});
  }

  function removeError(id: string) {
    errors.value = errors.value.filter(error => error.id !== id);
  }

  return {
    isSidebarVisible,
    isAboutVisible,
    errors,
    toggleSidebar,
    showAbout,
    hideAbout,
    addError,
    removeError
  };
});