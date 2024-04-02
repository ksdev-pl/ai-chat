<script setup lang="ts">
  import {computed, ref} from 'vue';
  import OpenAI from 'openai';
  import {PlayIcon} from '@heroicons/vue/24/outline';
  import type {ChatCompletionMessageParam} from 'openai/resources/chat/completions';
  import {Role} from '@/models/role.model';
  import {useChatStore} from '@/stores/chat.store';
  import MarkdownIt from 'markdown-it';
  import hljs from 'highlight.js';

  const input = ref('');
  const numOfInputRows = ref(1);
  const inputTextarea = ref<HTMLTextAreaElement|null>(null);
  const chatStore = useChatStore();
  const scrollingDiv = ref<HTMLElement|null>(null);

  const md = new MarkdownIt({
    breaks: true,
    linkify: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, {language: lang}).value;
        } catch (__) {}
      }
      return ''; // use external default escaping
    }
  }) as any;

  const isSendBtnEnabled = computed(() => input.value?.trim().length > 0);

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  async function onSend() {
    inputTextarea.value?.blur();
    await chatStore.addMessage({role: Role.user, content: input.value});
    scrollDown();
    sendRequestForTitle(input.value);
    input.value = '';
    sendRequestForResponse();
  }

  async function sendRequestForTitle(message: string) {
    if (chatStore.currentChat && !chatStore.currentChat.title) {
      const completion = await openai.chat.completions.create({
        messages: [{
          role: Role.user,
          content: 'Summarize the input as title of no more than 5 words.'
            + `Output only the summarized title. The input is: ${message}`
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
        <template v-for="(message, index) in chatStore.currentChat.messages" :key="index">
          <template v-if="message.content && message.role === Role.user">
            <div class="flex">
              <div class="bg-green-600 py-2 px-3 rounded mb-4 text-white whitespace-pre-wrap">{{message.content}}</div>
            </div>
          </template>
          <template v-if="message.content && message.role === Role.assistant">
            <div class="flex">
              <div class="py-2 px-3 rounded mb-4 ml-5 message-content" v-html="md.render(message.content)"/>
            </div>
          </template>
        </template>
      </template>
    </main>
    <div class="flex w-full p-4" @focusin="numOfInputRows = 5" @focusout="numOfInputRows = 1">
      <textarea class="bg-gray-100 flex-grow p-2 rounded"
                :rows="numOfInputRows"
                placeholder="Enter your question..."
                ref="inputTextarea"
                v-model="input"
                @keydown.ctrl.enter="onSend"
                autofocus />
      <button class="ml-2 p-2 rounded bg-blue-600 hover:bg-blue-500 active:bg-blue-600 active:outline active:outline-2 active:outline-blue-500 disabled:bg-gray-100 disabled:text-gray-300 text-white"
              @click="onSend"
              :disabled="!isSendBtnEnabled">
        <PlayIcon class="h-6 w-6"></PlayIcon>
      </button>
    </div>
  </div>
</template>

<style>
  @import 'highlight.js/styles/github.css';

  .message-content {
    pre:not(:last-child),
    p:not(:last-child),
    ol:not(:last-child),
    ul:not(:last-child),
    li:not(:last-child),
    table:not(:last-child),
    blockquote:not(:last-child),
    hr:not(:last-child),
    h1, h2, h3, h4, h5, h6 {
      margin-bottom: 0.5rem;
    }

    blockquote {
      margin-left: 1rem;
      font-style: italic;
    }

    h1 {
      font-size: 1.5rem;
    }

    h2 {
      font-size: 1.25rem;
    }

    h3 {
      font-size: 1.125rem;
    }

    h1, h2, h3, h4, h5, h6 {
      font-weight: bold;
    }

    pre {
      margin-left: 1rem;
      background-color: rgb(249 250 251);
      display: inline-block;
      border-radius: 5px;
      padding: 0 5px;
    }

    code:not(pre code) {
      background-color: rgb(249 250 251);
      border-radius: 5px;
      padding: 0 1px;
    }

    a {
      color: rgb(37 99 235);
    }

    ul {
      list-style-type: disc;
      margin-left: 2rem;
    }

    ol {
      list-style-type: decimal;
      margin-left: 2rem;
    }

    td, th {
      border: 1px solid black;
      padding: 5px;
    }
  }
</style>