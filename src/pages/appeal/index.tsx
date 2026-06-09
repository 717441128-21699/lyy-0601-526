import React, { useState } from 'react';
import { View, Text, ScrollView, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { violationRecords } from '@/data/reservations';
import styles from '../common.module.scss';

const AppealPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState('');
  const [reason, setReason] = useState('');
  const [contact, setContact] = useState('');

  const handleSubmit = () => {
    if (!selectedId) {
      Taro.showToast({ title: '请选择申诉记录', icon: 'none' });
      return;
    }
    if (!reason.trim()) {
      Taro.showToast({ title: '请填写申诉理由', icon: 'none' });
      return;
    }

    console.log('[Appeal] 提交申诉:', { selectedId, reason, contact });
    Taro.showToast({ title: '申诉已提交', icon: 'success' });
    setTimeout(() => Taro.navigateBack(), 1000);
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.formSection}>
        <Text className={styles.formTitle}>⚠️ 选择申诉记录</Text>
        {violationRecords.length > 0 ? violationRecords.map(record => (
          <View
            key={record.id}
            className={styles.listItem}
            onClick={() => setSelectedId(record.id)}
            style={{ border: selectedId === record.id ? '2rpx solid #2563EB' : undefined }}
          >
            <View className={styles.itemLeft}>
              <View className={`${styles.itemIcon} ${styles.iconRed}`}><Text>⚠️</Text></View>
              <View className={styles.itemContent}>
                <Text className={styles.itemTitle}>{record.reason}</Text>
                <Text className={styles.itemDesc}>{record.date} · 扣{record.pointsDeducted}分</Text>
              </View>
            </View>
            {selectedId === record.id && <Text style={{ color: '#2563EB' }}>✓</Text>}
          </View>
        )) : (
          <Text style={{ textAlign: 'center', color: '#94A3B8', padding: 32 }}>暂无违规记录</Text>
        )}
      </View>

      <View className={styles.formSection}>
        <Text className={styles.formTitle}>📝 申诉信息</Text>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>申诉理由 *</Text>
          <Textarea
            className={styles.formTextarea}
            placeholder="请详细描述申诉理由..."
            value={reason}
            onInput={(e) => setReason(e.detail.value)}
          />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>联系方式</Text>
          <Textarea
            className={styles.formInput}
            placeholder="手机号（可选，方便联系）"
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
