import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { Device } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import styles from './index.module.scss';

interface DeviceCardProps {
  device: Device;
  onClick?: () => void;
  showFavorite?: boolean;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onClick, showFavorite = true }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/device-detail/index?id=${device.id}`
      });
    }
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.imageWrapper}>
        <Image
          className={styles.image}
          src={device.image}
          mode="aspectFill"
          lazyLoad
          onError={(e) => console.error('[DeviceCard] 图片加载失败:', e.detail)}
        />
        {showFavorite && device.isFavorite && (
          <View className={styles.favoriteBadge}>
            <Text className={styles.favoriteIcon}>★</Text>
          </View>
        )}
      </View>
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.name}>{device.name}</Text>
          <StatusBadge status={device.status} size="sm" />
        </View>
        <Text className={styles.model}>{device.model}</Text>
        <Text className={styles.location}>{device.labName}</Text>
        <View className={styles.tags}>
          <View className={classnames(styles.tag, styles.blue)}>
            <Text className={styles.tagText}>{device.type}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DeviceCard;
