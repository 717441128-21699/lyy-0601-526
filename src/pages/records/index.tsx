import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import { reservations } from '@/data/reservations';
import { useUserStore } from '@/store/useUserStore';
import { Reservation } from '@/types';
import styles from '../common.module.scss';

const RecordsPage: React.FC = () => {
  const { user, role } = useUserStore();
  const [filter, setFilter] = useState('all');
  const [list, setList] = useState<Reservation[]>([]);

  const filters = [
    { key: 'all', label: '全部' },
    { key: 'completed', label: '已完成' },
    { key: 'approved', label: '待使用' },
    { key: 'cancelled', label: '已取消' },
  ];

  useEffect(() => {
    let data = role === 'labAssistant' ? [...reservations] : reservations.filter(r => r.userId === user.id);
    if (filter !== 'all') {
      data = data.filter(r => r.status === filter);
    }
    setList(data);
  }, [filter, user.id, role]);

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.filterBar}>
        {filters.map(f => (
          <View
            key={f.key}
            className={classnames(styles.filterItem, filter === f.key && styles.active)}
            onClick={() => setFilter(f.key)}
          >
            <Text className={styles.filterText}>{f.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.listContainer}>
        {list.length > 0 ? list.map(item => (
          <View key={item.id} className={styles.card}>
            <View className={styles.cardHeader}>
              <Text className={styles.cardTitle}>{item.deviceName}</Text>
              <StatusBadge status={item.status} size="sm" />
            </View>
            <Text className={styles.cardSubtitle}>{item.labName}</Text>
            <Text className={styles.cardTime}>{item.date} {item.startTime}-{item.endTime} · {item.purpose}</Text>
            {item.usageResult && (
              <Text className={styles.cardTime}>使用结果: {item.usageResult}</Text>
            )}
          </View>
        )) : (
          <EmptyState icon="📊" title="暂无记录" description="完成预约使用后会在这里显示" />
        )}
      </View>
    </ScrollView>
  );
};

export default RecordsPage;
