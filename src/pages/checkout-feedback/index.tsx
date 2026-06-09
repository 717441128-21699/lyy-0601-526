import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { reservations } from '@/data/reservations';
import { Reservation } from '@/types';
import styles from './index.module.scss';

const usageResults = [
  { key: 'success', label: '✅ 正常完成', desc: '设备运行正常' },
  { key: 'minor', label: '⚠️ 轻微异常', desc: '不影响使用' },
  { key: 'major', label: '❌ 严重故障', desc: '无法正常使用' },
];

const CheckoutFeedbackPage: React.FC = () => {
  const router = useRouter();
  const id = router.params.id as string;
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [usageResult, setUsageResult] = useState('');
  const [abnormalFeedback, setAbnormalFeedback] = useState('');
  const [remark, setRemark] = useState('');

  useEffect(() => {
    const found = reservations.find(r => r.id === id);
    if (found) {
      setReservation(found);
    }
  }, [id]);

  const handleSubmit = () => {
    if (!usageResult) {
      Taro.showToast({ title: '请选择使用结果', icon: 'none' });
      return;
    }

    const idx = reservations.findIndex(r => r.id === id);
    if (idx !== -1) {
      reservations[idx].checkOutTime = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      reservations[idx].status = 'completed';
      reservations[idx].usageResult = usageResult;
      reservations[idx].abnormalFeedback = abnormalFeedback;
      reservations[idx].checkoutRemark = remark;
    }

    console.log('[Checkout] 签退:', { id, usageResult, abnormalFeedback, remark });
    Taro.showToast({ title: '签退成功', icon: 'success' });
    setTimeout(() => Taro.switchTab({ url: '/pages/checkin/index' }), 1000);
  };

  if (!reservation) {
    return (
      <ScrollView className={styles.page} scrollY>
        <View className={styles.section}>
          <Text>加载中...</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>📋 预约信息</Text>
        <View className={styles.infoBox}>
          <Text style={{ fontWeight: 600, color: '#0F172A' }}>{reservation.deviceName}{'\n'}</Text>
          <Text>🏢 实验室: {reservation.labName}{'\n'}</Text>
          <Text>📅 日期: {reservation.date}{'\n'}</Text>
          <Text>⏰ 时段: {reservation.startTime}-{reservation.endTime}{'\n'}</Text>
          <Text>✅ 签到时间: {reservation.checkInTime}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>📊 使用结果 *</Text>
        <View className={styles.radioGroup}>
          {usageResults.map(item => (
            <View
              key={item.key}
              className={classnames(styles.radioItem, usageResult === item.key && styles.selected)}
              onClick={() => setUsageResult(item.key)}
            >
              <Text className={styles.radioText}>{item.label}{'\n'}{item.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>⚠️ 异常反馈</Text>
        <View className={styles.formItem}>
          <Text className={styles.label}>设备异常情况描述</Text>
          <Textarea
            className={styles.textarea}
            placeholder="如设备存在异常，请详细描述问题（可选）"
            value={abnormalFeedback}
            onInput={(e) => setAbnormalFeedback(e.detail.value)}
          />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.label}>其他备注</Text>
          <Textarea
            className={styles.textarea}
            placeholder="其他需要说明的情况（可选）"
            value={remark}
            onInput={(e) => setRemark(e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.btnSecondary} onClick={() => Taro.navigateBack()}>
          <Text className={styles.btnText}>取消</Text>
        </View>
        <View className={styles.btnPrimary} onClick={handleSubmit}>
          <Text className={styles.btnText}>确认签退</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default CheckoutFeedbackPage;
