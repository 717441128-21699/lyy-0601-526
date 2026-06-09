import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useUserStore } from '@/store/useUserStore';
import { violationRecords } from '@/data/reservations';
import styles from '../common.module.scss';

const CreditDetailPage: React.FC = () => {
  const { user } = useUserStore();

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

  const level = getLevel(user.creditScore);

  return (
    <ScrollView className={styles.page} scrollY>
      <View style={{
        background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
        padding: 48,
        textAlign: 'center',
        color: '#fff',
      }}>
        <Text style={{ fontSize: 24, opacity: 0.9 }}>当前信用分</Text>
        <Text style={{ fontSize: 80, fontWeight: 'bold', display: 'block', marginVertical: 16 }}>{user.creditScore}</Text>
        <Text style={{ fontSize: 28, color: level.color, background: '#fff', padding: '8rpx 24rpx', borderRadius: 8 }}>{level.text}</Text>
        <Text style={{ fontSize: 24, opacity: 0.85, marginTop: 16 }}>{level.desc}</Text>
      </View>

      <View className={styles.listContainer}>
        <View className={styles.card}>
          <View className={styles.cardHeader}>
            <Text className={styles.cardTitle}>📊 计分规则</Text>
          </View>
          <Text className={styles.cardTime}>• 按时签到并完成使用 +2分</Text>
          <Text className={styles.cardTime}>• 预约未签到 -5分</Text>
          <Text className={styles.cardTime}>• 超时使用每10分钟 -2分</Text>
          <Text className={styles.cardTime}>• 违规操作 -5~10分</Text>
          <Text className={styles.cardTime}>• 连续5次良好可额外 +3分</Text>
        </View>

        <View className={styles.card}>
          <View className={styles.cardHeader}>
            <Text className={styles.cardTitle}>📋 信用记录</Text>
          </View>
          {creditRecords.map(record => (
            <View key={record.id} className={styles.listItem} style={{ marginBottom: 12, padding: 24 }}>
              <View className={styles.itemLeft} style={{ gap: 16 }}>
                <View className={`${styles.itemIcon} ${record.type === 'add' ? styles.iconGreen : styles.iconRed}`} style={{ width: 56, height: 56, fontSize: 24 }}>
                  <Text>{record.type === 'add' ? '↑' : '↓'}</Text>
                </View>
                <View className={styles.itemContent}>
                  <Text className={styles.itemTitle}>{record.reason}</Text>
                  <Text className={styles.itemDesc}>{record.date}</Text>
                </View>
              </View>
              <Text className={styles.itemValue} style={{ color: record.type === 'add' ? '#10B981' : '#EF4444' }}>
                {record.points}
              </Text>
            </View>
          ))}
        </View>

        {violationRecords.length > 0 && (
          <View className={styles.card}>
            <View className={styles.cardHeader}>
              <Text className={styles.cardTitle}>⚠️ 违规记录</Text>
            </View>
            {violationRecords.map(record => (
              <View key={record.id} className={styles.listItem} style={{ marginBottom: 12, padding: 24 }}>
                <View className={styles.itemContent}>
                  <Text className={styles.itemTitle} style={{ color: '#EF4444' }}>{record.reason}</Text>
                  <Text className={styles.itemDesc}>{record.date} · 扣{record.pointsDeducted}分</Text>
                </View>
                <Text className={styles.itemValue} style={{ color: '#EF4444' }}>-{record.pointsDeducted}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default CreditDetailPage;
