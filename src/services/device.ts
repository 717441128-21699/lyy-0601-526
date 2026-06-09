import { Device, DeviceType, TimeSlot, FilterOptions } from '@/types';
import { devices, deviceTypes, timeSlots } from '@/data/devices';
import { generateId } from '@/utils';

export const getDeviceTypes = (): Promise<DeviceType[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(deviceTypes), 300);
  });
};

export const getDevices = (filters?: FilterOptions): Promise<Device[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...devices];
      
      if (filters?.labId) {
        result = result.filter(d => d.labId === filters.labId);
      }
      if (filters?.deviceType) {
        result = result.filter(d => d.type === filters.deviceType);
      }
      
      resolve(result);
    }, 300);
  });
};

export const getDeviceById = (id: string): Promise<Device | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(devices.find(d => d.id === id));
    }, 200);
  });
};

export const getTimeSlots = (deviceId: string, date: string): Promise<TimeSlot[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[DeviceService] 获取时段设备${deviceId}在${date}的时段`);
      resolve(timeSlots);
    }, 200);
  });
};

export const toggleFavorite = (deviceId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const device = devices.find(d => d.id === deviceId);
      if (device) {
        device.isFavorite = !device.isFavorite;
        console.log(`[DeviceService] 设备${deviceId}收藏状态已更新为${device.isFavorite}`);
      }
      resolve(device?.isFavorite || false);
    }, 200);
  });
};

export const getFavoriteDevices = (): Promise<Device[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(devices.filter(d => d.isFavorite));
    }, 300);
  });
};
