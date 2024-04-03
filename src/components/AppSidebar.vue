<script setup lang="ts">
  import {useAppStore} from '@/stores/app.store';
  import {useChatStore} from '@/stores/chat.store';
  import {TrashIcon} from '@heroicons/vue/24/outline';
  import {FwbButton} from 'flowbite-vue';
  import {ref} from 'vue';

  const activeChatId = ref<number|null|undefined>(null);

  const appStore = useAppStore();
  const chatStore = useChatStore();

  chatStore.reloadChats();
</script>

<template>
  <div class="p-4 bg-gray-100 w-64 flex flex-col text-gray-500" v-if="appStore.isSidebarVisible">
    <ul class="overflow-auto">
      <li class="mb-2">
        <a href="#" class="hover:text-blue-600 font-bold" @click="chatStore.setCurrentChatId(null)">New chat</a>
      </li>
      <li v-for="chat in chatStore.chats"
          :key="chat.id"
          @mouseenter="activeChatId = chat.id"
          @mouseleave="activeChatId = null"
          class="relative flex items-center justify-between">
        <div class="truncate">
          <a href="#"
             class="hover:text-blue-600"
             :title="chat.title ? chat.title : ''"
             @click="chatStore.setCurrentChatId(chat.id ? chat.id : null)">{{chat.title}}</a>
        </div>
        <div class="absolute right-0">
          <fwb-button color="red"
                      outline
                      size="xs"
                      class="bg-gray-100 rounded px-1 focus:ring-0"
                      @click="chatStore.deleteChat(chat.id)"
                      v-show="activeChatId === chat.id"
                      title="Delete chat">
            <TrashIcon class="h-3 w-3 cursor-pointer"></TrashIcon>
          </fwb-button>
        </div>
      </li>
    </ul>
  </div>
</template>