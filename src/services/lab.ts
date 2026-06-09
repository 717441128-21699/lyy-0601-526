import { Lab, LabNotification, Schedule } from '@/types';
import { labs, labNotifications } from '@/data/labs';
import { todaySchedule } from '@/data/reservations';

export const getLabs = (): Promise<Lab[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(labs), 300);
  });
};

export const getLabById = (id: string): Promise<Lab | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(labs.find(l => l.id === id));
    }, 200);
  });
};

export const getLabNotifications = (labId?: string): Promise<LabNotification[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...labNotifications];
      if (labId) {
        result = result.filter(n => n.labId === labId);
      }
      resolve(result);
    }, 300);
  });
};

export const getTodaySchedule = (assistantId: string): Promise<Schedule> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[LabService] 获取实验员${assistantId}的今日排班`);
      resolve(todaySchedule);
    }, 300);
  });
};

export const createNotification = (notification: Omit<LabNotification, 'id' | 'createdAt'>): Promise<LabNotification> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newNotification: LabNotification = {
        ...notification,
        id: Date.now().toString(36),
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      labNotifications.unshift(newNotification);
      console.log(`[LabService] 创建通知成功: ${newNotification.title}`);
      resolve(newNotification);
    }, 300);
  });
};
