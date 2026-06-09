import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import DeviceCard from '@/components/DeviceCard';
import EmptyState from '@/components/EmptyState';
import { devices } from '@/data/devices';
import { Device } from '@/types';
import styles from '../common.module.scss';

const FavoritesPage: React.FC = () => {
  const [list, setList] = useState<Device[]>([]);

  useEffect(() => {
    setList(devices.filter(d => d.isFavorite));
  }, []);

  const handleDeviceClick = (device: Device) => {
    Taro.navigateTo({ url: `/pages/device-detail/index?id=${device.id}` });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.listContainer}>
        {list.length > 0 ? list.map(device => (
          <DeviceCard
            key={device.id}
            device={device}
            onClick={() => handleDeviceClick(device)}
          />
        )) : (
          <EmptyState icon="⭐" title="暂无收藏" description="快去收藏常用的设备吧" />
        )}
      </View>
    </ScrollView>
  );
};

export default FavoritesPage;
