import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import StatusBadge from '@/components/StatusBadge';
import { reservations } from '@/data/reservations';
import { Reservation } from '@/types';
import styles from './index.module.scss';

type TabType = 'pending' | 'approved' | 'rejected';

const AuditPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [list, setList] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  const tabs: { key: TabType; label: string }[] = [
    { key: 'pending', label: '待审核' },
    { key: 'approved', label: '已通过' },
    { key: 'rejected', label: '已拒绝' },
  ];

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = () => {
    console.log('[Audit] 加载:', activeTab);
    setLoading(true);
    setTimeout(() => {
      const statusMap: Record<TabType, string[]> = {
        pending: ['pending'],
        approved: ['approved'],
        rejected: ['rejected'],
      };
      setList(reservations.filter(r => statusMap[activeTab].includes(r.status)));
      setLoading(false);
    }, 300);
  };

  const handleAction = (item: Reservation, action: 'approve' | 'reject') => {
    const title = action === 'approve' ? '通过预约' : '拒绝预约';
    Taro.showModal({
      title,
      content: `确定要${title}吗？`,
      success: (res) => {
        if (res.confirm) {
          const idx = reservations.findIndex(r => r.id === item.id);
          if (idx !== -1) {
            reservations[idx].status = action === 'approve' ? 'approved' : 'rejected';
            reservations[idx].auditedAt = new Date().toISOString();
          }
          console.log('[Audit]', action, item.id);
          Taro.showToast({ title: '操作成功', icon: 'success' });
          loadData();
        }
      }
    });
  };

  const getCount = (status: string) => reservations.filter(r => r.status === status).length;

  return (
    <ScrollView className={styles.page} scrollY refresherEnabled refresherTriggered={loading} onRefresherRefresh={() => { loadData(); setTimeout(() => Taro.stopPullDownRefresh(), 500); }}>
      <View className={styles.tabBar}>
        {tabs.map(tab => (
          <View key={tab.key} className={classnames(styles.tabItem, activeTab === tab.key && styles.active)} onClick={() => setActiveTab(tab.key)}>
            <Text className={styles.tabText}>{tab.label}</Text>
            {tab.key === 'pending' && getCount('pending') > 0 && (
              <View className={styles.tabBadge}><Text className={styles.tabBadgeText}>{getCount('pending')}</Text></View>
            )}
          </View>
        ))}
      </View>

      {loading ? (
        <View className={styles.loading}><Text>加载中...</Text></View>
      ) : list.length > 0 ? (
        <View className={styles.list}>
          {list.map(item => (
            <View key={item.id} className={styles.card}>
              <View className={styles.cardHeader}>
                <Text className={styles.deviceName}>{item.deviceName}</Text>
                <StatusBadge status={item.status} size="sm" />
              </View>
              <Text className={styles.userInfo}>申请人: {item.userName}</Text>
              <Text className={styles.timeInfo}>{item.date} {item.startTime}-{item.endTime} · {item.labName}</Text>
              <Text className={styles.purpose}>用途: {item.purpose}</Text>
              {item.teamMembers && item.teamMembers.length > 0 && (
                <Text className={styles.timeInfo}>同组: {item.teamMembers.map(m => m.name).join('、')}</Text>
              )}
              {activeTab === 'pending' && (
                <View className={styles.actionBar}>
                  <View className={classnames(styles.btn, styles.btnReject)} onClick={() => handleAction(item, 'reject')}>
                    <Text>拒绝</Text>
                  </View>
                  <View className={classnames(styles.btn, styles.btnApprove)} onClick={() => handleAction(item, 'approve')}>
                    <Text>通过</Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      ) : (
        <View className={styles.empty}>
          <Text className={styles.emptyIcon}>📋</Text>
          <Text className={styles.emptyText}>暂无{activeTab === 'pending' ? '待审核' : activeTab === 'approved' ? '已通过' : '已拒绝'}记录</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default AuditPage;
