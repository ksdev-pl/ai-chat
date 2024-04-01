import type {Message} from '@/models/message.model';

export interface Chat {
  id?: number,
  messages: Message[]
}