<script setup lang="ts">
  import {FwbButton, FwbInput, FwbModal, FwbSelect} from 'flowbite-vue';
  import {computed, ref, watch} from 'vue';
  import {useSettingsStore} from '@/stores/settings.store';
  import {any, object, string} from 'zod';
  import type {Settings} from '@/models/settings.model';
  import validator from 'validator';

  const models = [
      {name: 'gpt-3.5-turbo', value: 'gpt-3.5-turbo'},
      {name: 'gpt-4-turbo', value: 'gpt-4-turbo'},
      {name: 'gpt-4-turbo-preview', value: 'gpt-4-turbo-preview'},
      {name: 'gpt-4', value: 'gpt-4'},
      {name: 'gpt-4o', value: 'gpt-4o'},
      {name: 'gpt-4o-mini', value: 'gpt-4o-mini'},
      {name: 'gpt-4o-2024-08-06', value: 'gpt-4o-2024-08-06'},
      {name: 'chatgpt-4o-latest', value: 'chatgpt-4o-latest'}
    ];

  const settingsStore = useSettingsStore();

  const form = ref<Settings>({
    openaiApiKey: '',
    openaiTemp: '',
    openaiModel: '',
    openaiMaxTokens: ''
  });

  const formSchema = object({
    openaiApiKey: string().min(1),
    openaiTemp: any().transform((val) => val.toString()).refine(val => validator.isFloat(val)),
    openaiModel: string(),
    openaiMaxTokens: any().transform((val) => val.toString()).refine(val => validator.isFloat(val))
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
      form.value.openaiApiKey = settingsStore.apiKey;
      form.value.openaiTemp = settingsStore.temp;
      form.value.openaiModel = settingsStore.model;
      form.value.openaiMaxTokens = settingsStore.maxTokens;
    }
  });
</script>

<template>
  <fwb-modal v-if="settingsStore.areSettingsVisible" @close="settingsStore.hideSettings()" not-escapable persistent>
    <template #header>
      <div class="text-lg">OpenAI settings</div>
    </template>
    <template #body>
      <div class="mb-3"><fwb-input v-model="form.openaiApiKey" label="API key" type="password" /></div>
      <div class="mb-3"><fwb-select v-model="form.openaiModel" label="Model" placeholder="Select one" :options="models" /></div>
      <div class="mb-3"><fwb-input v-model="form.openaiMaxTokens" label="Max tokens" type="number"  /></div>
      <div><fwb-input v-model="form.openaiTemp" label="Temperature" type="number" step="0.1"  /></div>
    </template>
    <template #footer>
      <div class="flex justify-end">
        <fwb-button @click="onSave" color="blue" :disabled="!isSaveEnabled" class="rounded">Save</fwb-button>
        <fwb-button @click="settingsStore.hideSettings()" color="alternative" class="rounded ml-2">Close</fwb-button>
      </div>
    </template>
  </fwb-modal>
</template>