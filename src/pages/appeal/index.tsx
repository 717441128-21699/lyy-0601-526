import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { violationRecords } from '@/data/reservations';
import { ViolationRecord } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import styles from './index.module.scss';

const statusTextMap: Record<string, string> = {
  pending: '待处理',
  appealed: '申诉中',
  resolved: '已处理',
};

const AppealPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState('');
  const [reason, setReason] = useState('');
  const [contact, setContact] = useState('');
  const [records, setRecords] = useState<ViolationRecord[]>([]);

  useEffect(() => {
    setRecords([...violationRecords]);
  }, []);

  const getStatusText = (status: string) => statusTextMap[status] || status;

  const handleSubmit = () => {
    if (!selectedId) {
      Taro.showToast({ title: '请选择申诉记录', icon: 'none' });
      return;
    }
    if (!reason.trim()) {
      Taro.showToast({ title: '请填写申诉理由', icon: 'none' });
      return;
    }

    const idx = violationRecords.findIndex(r => r.id === selectedId);
    if (idx !== -1) {
      violationRecords[idx].status = 'appealed';
      violationRecords[idx].appealContent = reason;
      setRecords([...violationRecords]);
    }

    console.log('[Appeal] 提交申诉:', { selectedId, reason, contact });
    Taro.showToast({ title: '申诉已提交', icon: 'success' });
    setTimeout(() => Taro.navigateBack(), 1000);
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>⚠️ 选择申诉记录</Text>
        {records.length > 0 ? records.map(record => (
          <View
            key={record.id}
            className={classnames(styles.recordItem, selectedId === record.id && styles.selected)}
            onClick={() => setSelectedId(record.id)}
          >
            <View className={styles.recordLeft}>
              <View className={styles.recordIcon}><Text>⚠️</Text></View>
              <View className={styles.recordContent}>
                <View className={styles.recordHeader}>
                  <Text className={styles.recordTitle}>{record.description}</Text>
                  <View className={styles.statusBadge} data-status={record.status}>
                    <Text>{getStatusText(record.status)}</Text>
                  </View>
                </View>
                <View className={styles.recordMeta}>
                  <Text className={styles.recordDate}>📅 {record.date}</Text>
                  <Text className={styles.recordPoints}>❌ 扣{record.scoreDeducted}分</Text>
                </View>
              </View>
            </View>
            {selectedId === record.id && <Text className={styles.checkIcon}>✓</Text>}
          </View>
        )) : (
          <View className={styles.empty}>
            <Text className={styles.emptyText}>暂无违规记录</Text>
          </View>
        )}
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>📝 申诉信息</Text>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>申诉理由 *</Text>
          <Textarea
            className={styles.textarea}
            placeholder="请详细描述申诉理由，包括具体情况和相关证据..."
            value={reason}
            onInput={(e) => setReason(e.detail.value)}
          />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>联系方式</Text>
          <Textarea
            className={styles.input}
            placeholder="手机号（可选，方便联系您核实情况）"
            value={contact}
            onInput={(e) => setContact(e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.btnSecondary} onClick={() => Taro.navigateBack()}>
          <Text className={styles.btnText}>取消</Text>
        </View>
        <View className={styles.btnPrimary} onClick={handleSubmit}>
          <Text className={styles.btnText}>提交申诉</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default AppealPage;
