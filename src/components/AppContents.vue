<script setup lang="ts">
  import {computed, onMounted, ref, watch} from 'vue';
  import OpenAI from 'openai';
  import {PlayIcon} from '@heroicons/vue/24/outline';
  import type {ChatCompletionMessageParam} from 'openai/resources/chat/completions';
  import {Role} from '@/models/role.model';
  import {useChatStore} from '@/stores/chat.store';
  import MarkdownIt from 'markdown-it';
  import hljs from 'highlight.js';
  import {useSettingsStore} from '@/stores/settings.store';
  import {FwbAlert, FwbButton, FwbSpinner} from 'flowbite-vue';
  import {useAppStore} from '@/stores/app.store';

  const input = ref('');
  const numOfInputRows = ref(1);
  const inputTextarea = ref<HTMLTextAreaElement|null>(null);
  const scrollingDiv = ref<HTMLElement|null>(null);
  const userScrolled = ref(false);
  const pending = ref(false);

  const appStore = useAppStore();
  const chatStore = useChatStore();
  const settingsStore = useSettingsStore();

  const md = new MarkdownIt({
    breaks: true,
    linkify: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, {language: lang}).value;
        } catch (e) {
          console.log(e);
        }
      }
      return '';
    }
  });

  const isInputEnabled = computed(() => settingsStore.apiKey.length > 0 && !pending.value);
  const isSendBtnEnabled = computed(() => input.value?.trim().length > 0 && settingsStore.apiKey.trim().length > 0);


  onMounted(() => {
    setTimeout(() => inputTextarea.value?.focus(), 100);
  });

  const openai = new OpenAI({
    apiKey: settingsStore.apiKey,
    dangerouslyAllowBrowser: true
  });

  async function onSend() {
    pending.value = true;
    try {
      userScrolled.value = false;
      inputTextarea.value?.blur();
      await chatStore.addMessage({role: Role.user, content: input.value});
      autoScrollDown();
      sendRequestForTitle(input.value);
      input.value = '';
      await sendRequestForResponse();
    } catch (e) {
      if (e instanceof Error) {
        appStore.addError(e.message);
      }
    }
    pending.value = false;
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
        model: settingsStore.model,
        temperature: +settingsStore.temp,
        max_tokens: +settingsStore.maxTokens,
        stream: true
      });
      for await (const chunk of stream) {
        await chatStore.updateLastMessageStream(chunk.choices[0]?.delta?.content || '');
        autoScrollDown();
      }
    }
  }

  function autoScrollDown() {
    if (scrollingDiv.value && !userScrolled.value) {
      scrollingDiv.value.scrollTop = scrollingDiv.value.scrollHeight;
    }
  }

  function checkIfUserScrolled() {
    if (scrollingDiv.value) {
      userScrolled.value = scrollingDiv.value.scrollTop + scrollingDiv.value.clientHeight !== scrollingDiv.value.scrollHeight;
    }
  }

  watch(() => settingsStore.apiKey, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      openai.apiKey = settingsStore.apiKey;
    }
  });
</script>

<template>
  <div class="flex flex-1 flex-col overflow-auto">
    <fwb-alert closable
               type="danger"
               class="mt-4 ml-4 mr-4 gap-0"
               v-for="error in appStore.errors"
               :key="error.id"
               @close="appStore.removeError(error.id)">
      {{error.message}}
    </fwb-alert>
    <main class="flex-1 p-4 overflow-auto" ref="scrollingDiv" @scroll="checkIfUserScrolled()">
      <template v-if="chatStore.currentChat">
        <template v-for="(message, index) in chatStore.currentChat.messages" :key="index">
          <template v-if="message.content && message.role === Role.user">
            <div class="flex">
              <div class="border-green-600 border-2 border-solid py-2 px-3 rounded mb-4 message-content" v-html="md.render(message.content)"/>
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
      <textarea class="p-2 overflow-x-hidden  w-full text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                :rows="numOfInputRows"
                :placeholder="pending ? 'Answering...' : (settingsStore.apiKey.length === 0 ? 'Enter your API key in settings' : `Chat with ${settingsStore.model}...`)"
                ref="inputTextarea"
                v-model="input"
                @keydown.ctrl.enter="onSend"
                :disabled="!isInputEnabled"/>
      <fwb-button color="default"
                  @click="onSend"
                  :disabled="!isSendBtnEnabled"
                  class="ml-2 p-2 rounded">
        <PlayIcon class="h-6 w-6" v-if="!pending"></PlayIcon>
        <fwb-spinner size="6" v-if="pending" />
      </fwb-button>
    </div>
  </div>
</template>

<style>
  @import '../../node_modules/highlight.js/styles/github.css';

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
      margin-top: 1rem;
    }

    pre {
      margin-left: 1rem;
      background-color: rgb(249 250 251);
      display: table;
      border-radius: 5px;
      padding: 0 5px;
      white-space: pre-wrap;
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
