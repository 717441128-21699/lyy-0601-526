import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import { Message } from '@/types';
import { getMessageTypeText, formatDateTime } from '@/utils';
import styles from './index.module.scss';

interface MessageItemProps {
  message: Message;
  onClick?: () => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onClick }) => {
  const getTypeIcon = () => {
    const icons: Record<string, string> = {
      system: '⚙️',
      reservation: '📅',
      audit: '✅',
      notice: '📢',
    };
    return icons[message.type] || '📩';
  };

  const getTypeColor = () => {
    const colors: Record<string, string> = {
      system: 'blue',
      reservation: 'green',
      audit: 'yellow',
      notice: 'red',
    };
    return colors[message.type] || 'blue';
  };

  return (
    <View
      className={classnames(styles.item, !message.isRead && styles.unread)}
      onClick={onClick}
    >
      <View className={classnames(styles.iconWrapper, styles[getTypeColor()])}>
        <Text className={styles.icon}>{getTypeIcon()}</Text>
      </View>
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.title}>{message.title}</Text>
          <Text className={styles.time}>{formatDateTime(message.createdAt, 'MM-DD HH:mm')}</Text>
        </View>
        <Text className={styles.preview}>{message.content}</Text>
        <View className={styles.typeTag}>
          <Text className={styles.typeText}>{getMessageTypeText(message.type)}</Text>
        </View>
      </View>
      {!message.isRead && <View className={styles.dot} />}
    </View>
  );
};

export default MessageItem;
