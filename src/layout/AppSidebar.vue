<script setup lang="ts">
import {useAppStore} from '@/stores/app';

const store = useAppStore();

store.reloadChats();
</script>

<template>
  <div class="p-4 bg-gray-100 w-64 flex flex-col text-gray-500" v-if="store.isSidebarVisible">
    <ul class="overflow-auto">
      <li><a href="#" class="hover:text-blue-600 font-bold" @click="store.setCurrentChat(null)">New chat</a></li>
      <li v-for="chat in store.chats" :key="chat.id">
        <a href="#" class="hover:text-blue-600" v-if="chat.id" @click="store.setCurrentChat(chat.id)">{{chat.id}}</a>
      </li>
    </ul>
  </div>
</template>