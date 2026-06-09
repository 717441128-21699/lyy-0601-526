import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import MessageItem from '@/components/MessageItem';
import EmptyState from '@/components/EmptyState';
import { messages } from '@/data/messages';
import { getMessageTypeText, formatDateTime } from '@/utils';
import { Message } from '@/types';
import styles from './index.module.scss';

type FilterType = 'all' | 'system' | 'reservation' | 'audit' | 'notice';

const MessagePage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const filters: { key: FilterType; label: string; icon: string }[] = [
    { key: 'all', label: '全部', icon: '📩' },
    { key: 'system', label: '系统', icon: '⚙️' },
    { key: 'reservation', label: '预约', icon: '📅' },
    { key: 'audit', label: '审核', icon: '✅' },
    { key: 'notice', label: '通知', icon: '📢' },
  ];

  useEffect(() => {
    loadData();
  }, [activeFilter]);

  const loadData = useCallback(() => {
    console.log('[MessagePage] 加载消息, filter:', activeFilter);
    setLoading(true);

    setTimeout(() => {
      let result = [...messages];
      if (activeFilter !== 'all') {
        result = result.filter(m => m.type === activeFilter);
      }
      setMessageList(result);
      setLoading(false);
    }, 300);
  }, [activeFilter]);

  const handleMessageClick = async (message: Message) => {
    console.log('[MessagePage] 点击消息:', message.id);
    
    if (!message.isRead) {
      const idx = messages.findIndex(m => m.id === message.id);
      if (idx !== -1) {
        messages[idx].isRead = true;
        loadData();
      }
    }

    if (message.relatedId) {
      Taro.navigateTo({ url: `/pages/reservation/index` });
    }
  };

  const handleMarkAllAsRead = () => {
    Taro.showModal({
      title: '全部已读',
      content: '确定要将所有消息标记为已读吗？',
      success: (res) => {
        if (res.confirm) {
          console.log('[MessagePage] 标记全部已读');
          messages.forEach(m => m.isRead = true);
          loadData();
          Taro.showToast({ title: '已全部标记为已读', icon: 'success' });
        }
      }
    });
  };

  const getUnreadCountByType = (type: FilterType) => {
    if (type === 'all') {
      return messages.filter(m => !m.isRead).length;
    }
    return messages.filter(m => m.type === type && !m.isRead).length;
  };

  const getTypeIconClass = (type: string) => {
    const iconMap: Record<string, string> = {
      system: 'system',
      reservation: 'reservation',
      audit: 'audit',
      notice: 'notice',
    };
    return iconMap[type] || 'system';
  };

  const getTypeEmoji = (type: string) => {
    const emojiMap: Record<string, string> = {
      system: '⚙️',
      reservation: '📅',
      audit: '✅',
      notice: '📢',
    };
    return emojiMap[type] || '📩';
  };

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refresherEnabled
      refresherTriggered={loading}
      onRefresherRefresh={() => {
        loadData();
        setTimeout(() => Taro.stopPullDownRefresh(), 500);
      }}
    >
      <View className={styles.header}>
        <Text className={styles.headerTitle}>消息中心</Text>
        {getUnreadCountByType('all') > 0 && (
          <Text className={styles.markAllBtn} onClick={handleMarkAllAsRead}>
            全部已读
          </Text>
        )}
      </View>

      <ScrollView className={styles.typeFilter} scrollX showScrollbar={false}>
        {filters.map((filter) => {
          const unreadCount = getUnreadCountByType(filter.key);
          return (
            <View
              key={filter.key}
              className={classnames(styles.typeItem, activeFilter === filter.key && styles.active)}
              onClick={() => setActiveFilter(filter.key)}
            >
              <Text className={styles.typeText}>{filter.label}</Text>
              {unreadCount > 0 && (
                <View className={styles.typeBadge}>
                  <Text className={styles.typeBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {loading ? (
        <View className={styles.loading}>
          <Text>加载中...</Text>
        </View>
      ) : messageList.length > 0 ? (
        <View className={styles.listContainer}>
          {messageList.map((message) => (
            <View
              key={message.id}
              className={classnames(styles.messageItem, !message.isRead && styles.unread)}
              onClick={() => handleMessageClick(message)}
            >
              <View className={styles.messageHeader}>
                <View className={styles.messageType}>
                  <View className={classnames(styles.messageIcon, getTypeIconClass(message.type))}>
                    <Text>{getTypeEmoji(message.type)}</Text>
                  </View>
                  <Text className={styles.messageTypeName}>{getMessageTypeText(message.type)}</Text>
                </View>
                <Text className={styles.messageTime}>
                  {formatDateTime(message.createdAt, 'MM-DD HH:mm')}
                </Text>
              </View>
              <Text className={styles.messageTitle}>{message.title}</Text>
              <Text className={styles.messageContent}>{message.content}</Text>
              {!message.isRead && <View className={styles.unreadDot} />}
            </View>
          ))}
        </View>
      ) : (
        <EmptyState
          icon="🔔"
          title="暂无消息"
          description="有新消息时会在这里显示"
        />
      )}
    </ScrollView>
  );
};

export default MessagePage;
