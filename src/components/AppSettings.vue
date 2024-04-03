<script setup lang="ts">
  import {FwbButton, FwbInput, FwbModal, FwbSelect} from 'flowbite-vue';
  import {computed, ref, watch} from 'vue';
  import {useSettingsStore} from '@/stores/settings.store';
  import type {SettingsForm} from '@/models/settings-form.model';
  import {number, object, string} from 'zod';

  const models = [
      {name: 'gpt-3.5-turbo', value: 'gpt-3.5-turbo'},
      {name: 'gpt-4-turbo-preview', value: 'gpt-4-turbo-preview'},
      {name: 'gpt-4', value: 'gpt-4'},
    ];

  const settingsStore = useSettingsStore();

  const form = ref<SettingsForm>({
    apiKey: '',
    temp: 0,
    model: '',
    maxTokens: 0
  });

  const formSchema = object({
    apiKey: string().min(1),
    temp: number(),
    model: string(),
    maxTokens: number()
  });

  settingsStore.reloadSettings();

  const isSaveEnabled = computed(() => {
    return formSchema.safeParse(form.value).success;
  });

  async function onSave() {
    await settingsStore.updateSettings(form.value);
    settingsStore.hideSettings();
  }

  watch(() => settingsStore.dbReloadCount, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      form.value.apiKey = settingsStore.apiKey;
      form.value.temp = settingsStore.temp;
      form.value.model = settingsStore.model;
      form.value.maxTokens = settingsStore.maxTokens;
    }
  });
</script>

<template>
  <fwb-modal v-if="settingsStore.areSettingsVisible" @close="settingsStore.hideSettings()">
    <template #header>
      <div class="text-lg">OpenAI settings</div>
    </template>
    <template #body>
      <div class="mb-3"><fwb-input v-model="form.apiKey" label="API key" type="password" /></div>
      <div class="mb-3"><fwb-select v-model="form.model" label="Model" placeholder="Select one" :options="models" /></div>
      <div class="mb-3"><fwb-input v-model="form.maxTokens" label="Max tokens" type="number"  /></div>
      <div><fwb-input v-model="form.temp" label="Temperature" type="number" step="0.1"  /></div>
    </template>
    <template #footer>
      <div class="flex justify-end">
        <fwb-button @click="onSave" color="blue" :disabled="!isSaveEnabled" class="rounded">Save</fwb-button>
        <fwb-button @click="settingsStore.hideSettings()" color="alternative" class="rounded ml-2">Close</fwb-button>
      </div>
    </template>
  </fwb-modal>
</template>