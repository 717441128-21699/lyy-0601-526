import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import StatusBadge from '@/components/StatusBadge';
import TimeSlotPicker from '@/components/TimeSlotPicker';
import { devices } from '@/data/devices';
import { labs } from '@/data/labs';
import { timeSlots } from '@/data/devices';
import { Device, TimeSlot } from '@/types';
import styles from './index.module.scss';

const DeviceDetailPage: React.FC = () => {
  const router = useRouter();
  const deviceId = router.params.id as string;
  const [device, setDevice] = useState<Device | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  useEffect(() => {
    loadDevice();
    const today = new Date();
    setSelectedDate(today.toISOString().split('T')[0]);
  }, [deviceId]);

  const loadDevice = useCallback(() => {
    console.log('[DeviceDetail] 加载设备:', deviceId);
    const found = devices.find(d => d.id === deviceId);
    if (found) {
      setDevice(found);
    }
  }, [deviceId]);

  const handleToggleFavorite = () => {
    if (!device) return;
    console.log('[DeviceDetail] 切换收藏:', device.id);
    const idx = devices.findIndex(d => d.id === device.id);
    if (idx !== -1) {
      devices[idx].isFavorite = !devices[idx].isFavorite;
      setDevice({ ...devices[idx] });
      Taro.showToast({
        title: devices[idx].isFavorite ? '已收藏' : '已取消收藏',
        icon: 'success'
      });
    }
  };

  const handleSlotSelect = (slots: string[]) => {
    setSelectedSlots(slots);
    console.log('[DeviceDetail] 选择时段:', slots);
  };

  const handleReserve = () => {
    if (!device) return;
    
    if (device.status !== 'available') {
      Taro.showToast({ title: '该设备当前不可预约', icon: 'none' });
      return;
    }
    
    if (selectedSlots.length === 0) {
      Taro.showToast({ title: '请先选择预约时段', icon: 'none' });
      return;
    }
    
    console.log('[DeviceDetail] 提交预约:', device.id, selectedDate, selectedSlots);
    Taro.navigateTo({
      url: `/pages/submit-reservation/index?deviceId=${device.id}&date=${selectedDate}&slots=${selectedSlots.join(',')}`
    });
  };

  const getLabName = (labId: string) => {
    return labs.find(l => l.id === labId)?.name || '未知实验室';
  };

  if (!device) {
    return (
      <View className={styles.page}>
        <View className={styles.empty}>
          <Text className={styles.emptyText}>设备不存在或已下架</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <Image
        className={styles.deviceImage}
        src={device.image}
        mode="aspectFill"
      />

      <View className={styles.content}>
        <View className={styles.deviceHeader}>
          <View className={styles.deviceNameRow}>
            <Text className={styles.deviceName}>{device.name}</Text>
            <View className={styles.favoriteBtn} onClick={handleToggleFavorite}>
              <Text>{device.isFavorite ? '❤️' : '🤍'}</Text>
            </View>
          </View>
          <View className={styles.tags}>
            <View className={styles.tag}>
              <Text>{device.type}</Text>
            </View>
            <View className={styles.tag}>
              <Text>{getLabName(device.labId)}</Text>
            </View>
            <View className={styles.tag}>
              <Text>{device.model}</Text>
            </View>
          </View>
          <View className={styles.statusRow}>
            <StatusBadge status={device.status} size="md" />
            <View style={{ display: 'flex', gap: 32 }}>
              <View className={styles.infoItem}>
                <Text className={styles.infoItemLabel}>编号</Text>
                <Text>{device.code}</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoItemLabel}>位置</Text>
                <Text>{device.location}</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>📋 设备说明</Text>
          <Text className={styles.sectionContent}>{device.description}</Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>📜 开放规则</Text>
          <View className={styles.rulesList}>
            <View className={styles.ruleItem}>
              <Text className={styles.ruleIcon}>•</Text>
              <Text>开放时间: {device.openTime}</Text>
            </View>
            <View className={styles.ruleItem}>
              <Text className={styles.ruleIcon}>•</Text>
              <Text>单次最长使用: {device.maxUsageHours}小时</Text>
            </View>
            <View className={styles.ruleItem}>
              <Text className={styles.ruleIcon}>•</Text>
              <Text>需提前 {device.advanceBookingHours} 小时预约</Text>
            </View>
            <View className={styles.ruleItem}>
              <Text className={styles.ruleIcon}>•</Text>
              <Text>需实名认证并通过培训</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>⚠️ 安全要求</Text>
          <View className={styles.rulesList}>
            {device.safetyRequirements.map((req, idx) => (
              <View key={idx} className={styles.ruleItem}>
                <Text className={styles.ruleIcon}>•</Text>
                <Text>{req}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>⏰ 选择时段</Text>
          <TimeSlotPicker
            timeSlots={timeSlots}
            selectedSlots={selectedSlots}
            onSelect={handleSlotSelect}
            disabledSlots={device.status === 'unavailable' ? timeSlots.map(s => s.id) : []}
          />
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.btnSecondary} onClick={handleToggleFavorite}>
          <Text className={styles.btnText}>{device.isFavorite ? '已收藏' : '收藏'}</Text>
        </View>
        <View
          className={classnames(styles.btnPrimary, device.status !== 'available' && 'disabled')}
          onClick={handleReserve}
        >
          <Text className={styles.btnText}>
            {device.status !== 'available' ? '设备不可用' :
             selectedSlots.length > 0 ? `立即预约 (${selectedSlots.length}个时段)` : '选择时段'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default DeviceDetailPage;
