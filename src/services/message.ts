import { Message } from '@/types';
import { messages } from '@/data/messages';

export const getMessages = (type?: string): Promise<Message[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...messages];
      if (type) {
        result = result.filter(m => m.type === type);
      }
      resolve(result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }, 300);
  });
};

export const getUnreadCount = (): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(messages.filter(m => !m.isRead).length);
    }, 200);
  });
};

export const markAsRead = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const message = messages.find(m => m.id === id);
      if (message) {
        message.isRead = true;
        console.log(`[MessageService] 标记消息已读: ${id}`);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 200);
  });
};

export const markAllAsRead = (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      messages.forEach(m => {
        m.isRead = true;
      });
      console.log('[MessageService] 标记所有消息已读');
      resolve(true);
    }, 300);
  });
};

export const sendMessage = (message: Omit<Message, 'id' | 'createdAt' | 'isRead'>): Promise<Message> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMessage: Message = {
        ...message,
        id: Date.now().toString(36),
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        isRead: false,
      };
      messages.unshift(newMessage);
      console.log(`[MessageService] 发送消息成功: ${newMessage.title}`);
      resolve(newMessage);
    }, 300);
  });
};
