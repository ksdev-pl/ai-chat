import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import type {Chat} from '@/models/chat.model';
import {db} from '@/db';
import Dexie from 'dexie';
import type {Message} from '@/models/message.model';

export const useAppStore = defineStore('app', () => {
  const isSidebarVisible = ref(true);
  const chats = ref<Chat[]>([]);
  const currentChatId = ref<number|null>(null);

  const currentChat = computed(() => chats.value.find(item => item.id === currentChatId.value));

  function toggleSidebar() {
    isSidebarVisible.value = !isSidebarVisible.value;
  }

  async function reloadChats() {
    try {
      chats.value = await db.chats.toArray();
    } catch (error) {
      console.error(error);
    }
    console.log({reloadChats: currentChatId});
  }

  function setCurrentChat(chatId: number|null) {
    currentChatId.value = chatId;
  }

  function addMessageToCurrentChat(message: Message) {
    let messages;
    if (currentChat.value) {
      messages = currentChat.value.messages;
    } else {
      messages = [message];
    }
    storeOrUpdateCurrentChatInDb(messages);
  }

  async function storeOrUpdateCurrentChatInDb(messages: Message[]) {
    try {
      const rawMessages = Dexie.deepClone(messages);
      if (currentChatId.value === null) {
        currentChatId.value = await db.chats.add({
          messages: rawMessages,
        });
      } else {
        const currentChat = await db.chats.get({id: currentChatId.value});
        if (currentChat) {
          currentChat.messages = rawMessages;
          await db.chats.put(currentChat);
        } else {
          console.error(`Chat not in DB. ID: ${currentChatId.value}`);
        }
      }
      reloadChats();
    } catch (error) {
      console.error(error);
    }
  }

  return {
    isSidebarVisible,
    toggleSidebar,
    chats,
    currentChatId,
    currentChat,
    reloadChats,
    setCurrentChat,
    storeOrUpdateCurrentChatInDb,
    addMessageToCurrentChat
  };
});