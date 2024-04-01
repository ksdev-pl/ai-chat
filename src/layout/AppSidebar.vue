<script setup lang="ts">
  import {useAppStore} from '@/stores/app.store';
  import {useChatStore} from '@/stores/chat.store';

  const appStore = useAppStore();
  const chatStore = useChatStore();

  chatStore.reloadChats();
</script>

<template>
  <div class="p-4 bg-gray-100 w-64 flex flex-col text-gray-500" v-if="appStore.isSidebarVisible">
    <ul class="overflow-auto">
      <li class="mb-2"><a href="#" class="hover:text-blue-600 font-bold" @click="chatStore.currentChatId = null">New chat</a></li>
      <li v-for="chat in chatStore.chats" :key="chat.id">
        <a href="#" class="hover:text-blue-600" v-if="chat.id" @click="chatStore.currentChatId = chat.id">{{chat.id}}</a>
      </li>
    </ul>
  </div>
</template>