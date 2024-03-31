<script setup lang="ts">
import {ref} from 'vue';
import OpenAI from 'openai';

const input = ref('');

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

function onClick() {
  alert(openai.apiKey);
}
</script>

<template>
  <div class="flex flex-1 flex-col overflow-auto">
    <main class="flex-1 p-4 overflow-auto">
      Input: {{ input }}
    </main>
    <div class="flex w-full p-4">
      <input class="bg-gray-900 flex-grow p-2"
             type="text"
             placeholder="Input"
             v-model="input"/>
      <button class="ml-2 p-2 bg-gray-900 text-white" @click="onClick">Send</button>
    </div>
  </div>
</template>
