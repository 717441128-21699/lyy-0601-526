import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useUserStore } from '@/store/useUserStore';
import { violationRecords } from '@/data/reservations';
import { ViolationRecord } from '@/types';
import styles from './index.module.scss';

const statusTextMap: Record<string, string> = {
  pending: '待处理',
  appealed: '申诉中',
  resolved: '已处理',
};

const CreditDetailPage: React.FC = () => {
  const { user } = useUserStore();
  const [records, setRecords] = useState<ViolationRecord[]>([]);

  useEffect(() => {
    setRecords([...violationRecords]);
  }, []);

  const creditRecords = [
    { id: '1', date: '2024-01-15', reason: '按时完成预约使用', points: '+2', type: 'add' },
    { id: '2', date: '2024-01-14', reason: '预约未签到', points: '-5', type: 'deduct' },
    { id: '3', date: '2024-01-12', reason: '按时完成预约使用', points: '+2', type: 'add' },
    { id: '4', date: '2024-01-10', reason: '超时使用10分钟', points: '-2', type: 'deduct' },
    { id: '5', date: '2024-01-08', reason: '按时完成预约使用', points: '+2', type: 'add' },
  ];

  const getLevel = (score: number) => {
    if (score >= 90) return { text: '优秀', color: '#10B981', desc: '可享受优先预约权益' };
    if (score >= 80) return { text: '良好', color: '#3B82F6', desc: '可正常预约所有设备' };
    if (score >= 60) return { text: '及格', color: '#F59E0B', desc: '部分高价值设备受限' };
    return { text: '待提升', color: '#EF4444', desc: '预约权限受限' };
  };

  const getStatusText = (status: string) => statusTextMap[status] || status;

  const level = getLevel(user.creditScore);

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.headerLabel}>当前信用分</Text>
        <Text className={styles.headerScore}>{user.creditScore}</Text>
        <Text className={styles.headerLevel} style={{ color: level.color }}>{level.text}</Text>
        <Text className={styles.headerDesc}>{level.desc}</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.card}>
          <View className={styles.cardHeader}>
            <Text className={styles.cardTitle}>📊 计分规则</Text>
          </View>
          <View className={styles.rulesList}>
            <Text className={styles.ruleItem}>• 按时签到并完成使用 +2分</Text>
            <Text className={styles.ruleItem}>• 预约未签到 -5分</Text>
            <Text className={styles.ruleItem}>• 超时使用每10分钟 -2分</Text>
            <Text className={styles.ruleItem}>• 违规操作 -5~10分</Text>
            <Text className={styles.ruleItem}>• 连续5次良好可额外 +3分</Text>
          </View>
        </View>

        <View className={styles.card}>
          <View className={styles.cardHeader}>
            <Text className={styles.cardTitle}>📋 信用记录</Text>
          </View>
          {creditRecords.map(record => (
            <View key={record.id} className={styles.recordItem}>
              <View className={styles.recordLeft}>
                <View className={`${styles.recordIcon} ${record.type === 'add' ? styles.iconGreen : styles.iconRed}`}>
                  <Text>{record.type === 'add' ? '↑' : '↓'}</Text>
                </View>
                <View className={styles.recordContent}>
                  <Text className={styles.recordTitle}>{record.reason}</Text>
                  <Text className={styles.recordDate}>{record.date}</Text>
                </View>
              </View>
              <Text className={styles.recordPoints} style={{ color: record.type === 'add' ? '#10B981' : '#EF4444' }}>
                {record.points}
              </Text>
            </View>
          ))}
        </View>

        {records.length > 0 && (
          <View className={styles.card}>
            <View className={styles.cardHeader}>
              <Text className={styles.cardTitle}>⚠️ 违规记录</Text>
            </View>
            {records.map(record => (
              <View key={record.id} className={styles.violationItem}>
                <View className={styles.violationContent}>
                  <View className={styles.violationHeader}>
                    <Text className={styles.violationTitle}>{record.description}</Text>
                    <View className={styles.statusBadge} data-status={record.status}>
                      <Text>{getStatusText(record.status)}</Text>
                    </View>
                  </View>
                  <Text className={styles.violationDate}>📅 {record.date}</Text>
                </View>
                <Text className={styles.violationPoints}>-{record.scoreDeducted}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default CreditDetailPage;
