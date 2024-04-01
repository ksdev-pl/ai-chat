<script setup lang="ts">
import {computed, ref} from 'vue';
import OpenAI from 'openai';
import {PlayIcon} from '@heroicons/vue/24/outline';
import type {ChatCompletionMessageParam} from 'openai/resources/chat/completions';

const input = ref('');
const numOfInputRows = ref(1);
const inputTextarea = ref<HTMLTextAreaElement | null>(null);

const messages = ref<ChatCompletionMessageParam[]>([]);

const isSendBtnEnabled = computed(() => input.value?.trim().length > 0);

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

function onSend() {
  inputTextarea.value?.blur();

  messages.value.push({role: 'user', content: input.value});

  input.value = '';

  sendRequestToOpenAI();
}

async function sendRequestToOpenAI() {
  const completion = await openai.chat.completions.create({
    messages: messages.value,
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    max_tokens: 2025
  });
  messages.value.push(completion.choices[0].message);
}
</script>

<template>
  <div class="flex flex-1 flex-col overflow-auto">
    <main class="flex-1 p-4 overflow-auto">
      <div v-for="(message, index) in messages" :key="index" class="bg-gray-100 p-2 rounded mb-4 whitespace-pre-wrap" :class="{'bg-gray-100 mr-20': message.role === 'user', 'bg-gray-50 ml-20': message.role !== 'user'}">{{message.content}}</div>
    </main>
    <div class="flex w-full p-4" @focusin="numOfInputRows = 10" @focusout="numOfInputRows = 1">
      <textarea class="bg-gray-100 flex-grow p-2"
                :rows="numOfInputRows"
                placeholder="Enter your question..."
                ref="inputTextarea"
                v-model="input"
                @keydown.ctrl.enter="onSend" />
      <button class="ml-2 p-2 rounded bg-blue-600 hover:bg-blue-500 active:bg-blue-700 active:outline active:outline-2 active:outline-blue-500 disabled:bg-gray-100 disabled:text-gray-300 text-white"
              @click="onSend"
              :disabled="!isSendBtnEnabled">
        <PlayIcon class="h-6 w-6"></PlayIcon>
      </button>
    </div>
  </div>
</template>
