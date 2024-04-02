import type {Message} from '@/models/message.model';

export interface Chat {
  id?: number,
  title: string|null,
  messages: Message[]
}