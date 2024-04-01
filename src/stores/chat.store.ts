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

  async function reloadChats() {
    console.log('reloadChats');
    try {
      chats.value = await db.chats.toArray();
    } catch (error) {
      console.error(error);
    }
  }

  async function addMessageToCurrentChat(message: Message) {
    console.log('addMessageToCurrentChat');
    let messages;
    if (currentChat.value) {
      messages = currentChat.value.messages;
      messages.push(message);
    } else {
      messages = [message];
    }
    await storeOrUpdateCurrentChatInDb(messages);
  }

  async function storeOrUpdateCurrentChatInDb(messages: Message[]) {
    console.log('storeOrUpdateCurrentChatInDb');
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
      await reloadChats();
    } catch (error) {
      console.error(error);
    }
  }

  return {
    chats,
    currentChatId,
    currentChat,
    reloadChats,
    addMessageToCurrentChat
  };
});