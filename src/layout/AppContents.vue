<script setup lang="ts">
import {computed, ref} from 'vue';
import OpenAI from 'openai';
import {PlayIcon} from '@heroicons/vue/24/outline';
import type {ChatCompletionMessageParam} from 'openai/resources/chat/completions';
import {Role} from '@/models/role.model';
import {useChatStore} from '@/stores/chat.store';

const input = ref('');
  const numOfInputRows = ref(1);
  const inputTextarea = ref<HTMLTextAreaElement|null>(null);
  const chatStore = useChatStore();
  const scrollingDiv = ref<HTMLElement|null>(null);

  const isSendBtnEnabled = computed(() => input.value?.trim().length > 0);

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  async function onSend() {
    inputTextarea.value?.blur();
    await chatStore.addMessage({role: Role.user, content: input.value});
    sendRequestForTitle(input.value);
    input.value = '';
    sendRequestForResponse();
  }

  async function sendRequestForTitle(message: string) {
    if (chatStore.currentChat && !chatStore.currentChat.title) {
      const completion = await openai.chat.completions.create({
        messages: [{
          role: Role.user,
          content: 'Summarize the input in no more than 5 words using the same language as input.'
            + `Output only the title. The input is: ${message}`
        }],
        model: 'gpt-3.5-turbo',
        temperature: 0.4,
        max_tokens: 2025
      });
      await chatStore.setCurrentChatTitle(completion.choices[0].message.content);
    }
  }

  async function sendRequestForResponse() {
    if (chatStore.currentChat) {
      const stream = await openai.chat.completions.create({
        messages: chatStore.currentChat.messages as ChatCompletionMessageParam[],
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 2025,
        stream: true
      });
      for await (const chunk of stream) {
        await chatStore.updateLastMessageStream(chunk.choices[0]?.delta?.content || '');
        scrollDown();
      }
    }
  }

  function scrollDown() {
    if (scrollingDiv.value) {
      scrollingDiv.value.scrollTop = scrollingDiv.value.scrollHeight;
    }
  }
</script>

<template>
  <div class="flex flex-1 flex-col overflow-auto">
    <main class="flex-1 p-4 overflow-auto" ref="scrollingDiv">
      <template v-if="chatStore.currentChat">
        <div v-for="(message, index) in chatStore.currentChat.messages"
             :key="index" class="bg-gray-100 p-2 rounded mb-4 whitespace-pre-wrap"
             :class="{'bg-gray-100 mr-10': message.role === Role.user, 'bg-gray-50 ml-10': message.role === Role.assistant}">
          {{message.content}}
        </div>
      </template>
    </main>
    <div class="flex w-full p-4" @focusin="numOfInputRows = 10" @focusout="numOfInputRows = 1">
      <textarea class="bg-gray-100 flex-grow p-2 rounded"
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
