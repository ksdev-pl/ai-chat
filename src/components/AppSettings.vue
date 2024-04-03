<script setup lang="ts">
  import {FwbButton, FwbInput, FwbModal, FwbSelect} from 'flowbite-vue';
  import {computed} from 'vue';
  import {useSettingsStore} from '@/stores/settings.store';

  const models = [
      {name: 'gpt-3.5-turbo', value: 'gpt-3.5-turbo'},
      {name: 'gpt-4-turbo-preview', value: 'gpt-4-turbo-preview'},
      {name: 'gpt-4', value: 'gpt-4'},
    ];

  const settingsStore = useSettingsStore();

  settingsStore.reloadSettings();

  const isSaveEnabled = computed(() => {
    const isApiKeyValid = settingsStore.apiKey.trim().length > 0;
    const isModelValid = models.filter(item => item.value === settingsStore.model).length > 0;
    const isTempValid = settingsStore.temp != null; // TODO
    const isMaxTokensValid = settingsStore.maxTokens != null; // TODO
    return isApiKeyValid && isModelValid && isTempValid && isMaxTokensValid;
  });

  async function onSave() {
    await settingsStore.updateSettings();
    settingsStore.hideSettings();
  }
</script>

<template>
  <fwb-modal v-if="settingsStore.areSettingsVisible" @close="settingsStore.hideSettings()">
    <template #header>
      <div class="text-lg">OpenAI settings</div>
    </template>
    <template #body>
      <div class="mb-3"><fwb-input v-model="settingsStore.apiKey" label="API key" type="password" /></div>
      <div class="mb-3"><fwb-select v-model="settingsStore.model" label="Model" placeholder="Select one" :options="models" /></div>
      <div class="mb-3"><fwb-input v-model="settingsStore.maxTokens" label="Max tokens" type="number"  /></div>
      <div><fwb-input v-model="settingsStore.temp" label="Temperature" type="number" step="0.1"  /></div>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <fwb-button @click="settingsStore.hideSettings()" color="alternative">Close</fwb-button>
        <fwb-button @click="onSave" color="blue" :disabled="!isSaveEnabled">Save</fwb-button>
      </div>
    </template>
  </fwb-modal>
</template>