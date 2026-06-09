import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import { Lab } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import styles from './index.module.scss';

interface LabCardProps {
  lab: Lab;
  onClick?: () => void;
  selected?: boolean;
}

const LabCard: React.FC<LabCardProps> = ({ lab, onClick, selected = false }) => {
  return (
    <View
      className={classnames(styles.card, selected && styles.selected)}
      onClick={onClick}
    >
      <View className={styles.header}>
        <Text className={styles.name}>{lab.name}</Text>
        <StatusBadge status={lab.status} size="sm" />
      </View>
      <Text className={styles.location}>{lab.building} {lab.room}</Text>
      <View className={styles.footer}>
        <View className={styles.infoItem}>
          <Text className={styles.label}>容纳</Text>
          <Text className={styles.value}>{lab.capacity}人</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.label}>时间</Text>
          <Text className={styles.value}>{lab.openTime}-{lab.closeTime}</Text>
        </View>
      </View>
    </View>
  );
};

export default LabCard;
