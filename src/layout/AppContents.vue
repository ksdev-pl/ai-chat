<script setup lang="ts">
import {computed, ref} from 'vue';
import OpenAI from 'openai';
import {PlayIcon} from '@heroicons/vue/24/outline';
import type {ChatCompletionMessageParam} from 'openai/resources/chat/completions';
import {Role} from '@/models/role.model';
import {useAppStore} from '@/stores/app';

const input = ref('');
const numOfInputRows = ref(1);
const inputTextarea = ref<HTMLTextAreaElement | null>(null);

const store = useAppStore();

const isSendBtnEnabled = computed(() => input.value?.trim().length > 0);

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

function onSend() {
  inputTextarea.value?.blur();

  store.addMessageToCurrentChat({role: Role.user, content: input.value});

  input.value = '';

  sendRequestToOpenAI();
}

async function sendRequestToOpenAI() {
  console.log({sendRequestToOpenAI: store.currentChatId});
  if (store.currentChat) {
    const completion = await openai.chat.completions.create({
      messages: store.currentChat.messages as ChatCompletionMessageParam[],
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 2025
    });

    store.addMessageToCurrentChat({
      role: completion.choices[0].message.role as Role,
      content: completion.choices[0].message.content
    });
  }
}
</script>

<template>
  <div class="flex flex-1 flex-col overflow-auto">
    <main class="flex-1 p-4 overflow-auto">
      <template v-if="store.currentChat">
        <div v-for="(message, index) in store.currentChat.messages"
             :key="index" class="bg-gray-100 p-2 rounded mb-4 whitespace-pre-wrap"
             :class="{'bg-gray-100 mr-20': message.role === Role.user, 'bg-gray-50 ml-20': message.role === Role.assistant}">
          {{message.content}}
        </div>
      </template>
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
