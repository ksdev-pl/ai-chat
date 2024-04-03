import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import type {Chat} from '@/models/chat.model';
import {db} from '@/db';
import Dexie from 'dexie';
import type {Message} from '@/models/message.model';
import {Role} from '@/models/role.model';

export const useChatStore = defineStore('chat', () => {
  const chats = ref<Chat[]>([]);
  const currentChatId = ref<number|null>(null);

  const currentChat = computed(() => chats.value.find(item => item.id === currentChatId.value));

  function setCurrentChatId(id: number|null) {
    currentChatId.value = id;
  }

  async function reloadChats() {
    try {
      chats.value = await db.chats.reverse().toArray();
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
        setCurrentChatId(await db.chats.add({
          title: null,
          messages: [
            {role: Role.system, content: 'Always answer in markdown'},
            message
          ]
        }));
      } catch (e) {
        console.error(e);
      }
    }
    await reloadChats();
  }

  async function setCurrentChatTitle(title: string|null) {
    if (currentChat.value) {
      try {
        await db.chats.update(currentChatId.value, {title});
      } catch (e) {
        console.error(e);
      }
      await reloadChats();
    }
  }

  async function updateLastMessageStream(messageChunk: string) {
    if (currentChat.value) {
      const messages = Dexie.deepClone(currentChat.value.messages);
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === Role.assistant) {
        lastMessage.content += messageChunk;
      } else {
        messages.push({
          role: Role.assistant,
          content: messageChunk
        });
      }
      try {
        await db.chats.update(currentChatId.value, {messages});
      } catch (e) {
        console.error(e);
      }
      await reloadChats();
    }
  }

  async function deleteChat(chatId: number|null|undefined) {
    try {
      await db.chats.delete(chatId);
    } catch (e) {
      console.error(e);
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
    setCurrentChatTitle,
    updateLastMessageStream,
    deleteChat
  };
});