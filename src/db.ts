import Dexie from 'dexie';
import type {Table} from 'dexie';
import type {Chat} from '@/models/chat.model';

export class ChatDB extends Dexie {
  chats!: Table<Chat>;

  constructor() {
    super('ChatDB');
    this.version(1).stores({
      chats: '++id, messages'
    });
  }
}

export const db = new ChatDB();
