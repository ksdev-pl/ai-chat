import type {Table} from 'dexie';
import Dexie from 'dexie';
import type {Chat} from '@/models/chat.model';
import type {Settings} from '@/models/settings.model';

export class ChatDB extends Dexie {
  chats!: Table<Chat>;
  settings!: Table<Settings>;

  constructor() {
    super('chatdb');
    this.version(1).stores({
      chats: '++id',
      settings: '++id'
    });
  }
}

export const db = new ChatDB();
