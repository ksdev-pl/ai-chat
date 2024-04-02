import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import type {Chat} from '@/models/chat.model';
import {db} from '@/db';
import Dexie from 'dexie';
import type {Message} from '@/models/message.model';

export const useChatStore = defineStore('chat', () => {
  const chats = ref<Chat[]>([]);
  const currentChatId = ref<number|null>(null);

  const currentChat = computed(() => chats.value.find(item => item.id === currentChatId.value));

  function setCurrentChatId(id: number|null) {
    currentChatId.value = id;
  }

  async function reloadChats() {
    try {
      chats.value = await db.chats.toArray();
    } catch (e) {
      console.error(e);
    }
  }

  async function addMessage(message: Message) {
    if (currentChat.value) {
      const messages = [...Dexie.deepClone(currentChat.value.messages), message];
      try {
        await db.chats.update(currentChatId.value, {messages});
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        setCurrentChatId(await db.chats.add({title: null, messages: [message]}));
      } catch (e) {
        console.error(e);
      }
    }
    await reloadChats();
  }

  async function setChatTitle(title: string|null) {
    if (currentChat.value) {
      try {
        await db.chats.update(currentChatId.value, {title});
      } catch (e) {
        console.error(e);
      }
    }
    await reloadChats();
  }

  return {
    chats,
    currentChatId,
    currentChat,
    setCurrentChatId,
    reloadChats,
    addMessage,
    setChatTitle
  };
});