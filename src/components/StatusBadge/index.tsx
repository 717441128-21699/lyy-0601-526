import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import { getStatusText, getStatusColor } from '@/utils';
import styles from './index.module.scss';

interface StatusBadgeProps {
  status: string;
  text?: string;
  size?: 'sm' | 'md';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text, size = 'sm' }) => {
  const displayText = text || getStatusText(status);
  const colorClass = getStatusColor(status);

  return (
    <View
      className={classnames(
        styles.statusBadge,
        styles[colorClass],
        styles[size]
      )}
    >
      <Text className={styles.text}>{displayText}</Text>
    </View>
  );
};

export default StatusBadge;
