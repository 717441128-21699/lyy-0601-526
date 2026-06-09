import React, { useState } from 'react';
import { View, Text, ScrollView, Input, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { labs } from '@/data/labs';
import { labNotifications } from '@/data/labs';
import styles from '../common.module.scss';

const NotificationsPage: React.FC = () => {
  const [type, setType] = useState<'closure' | 'notice'>('closure');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedLab, setSelectedLab] = useState('');

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    const newNotification = {
      id: `n${Date.now()}`,
      type,
      title: title.trim(),
      content: content.trim(),
      labId: selectedLab,
      createdAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    labNotifications.unshift(newNotification);
    console.log('[Notification] 发布:', newNotification);
    Taro.showToast({ title: '发布成功', icon: 'success' });
    setTimeout(() => Taro.navigateBack(), 1000);
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.formSection}>
        <Text className={styles.formTitle}>📢 通知类型</Text>
        <View style={{ display: 'flex', gap: 16 }}>
          <View
            className={styles.formItem}
            style={{ flex: 1, padding: 24, background: type === 'closure' ? 'rgba(239,68,68,0.08)' : '#F8FAFC', borderRadius: 12, borderWidth: 2, borderColor: type === 'closure' ? '#EF4444' : '#E2E8F0' }}
            onClick={() => setType('closure')}
          >
            <Text style={{ textAlign: 'center', color: type === 'closure' ? '#EF4444' : '#64748B' }}>⚠️ 临时停用</Text>
          </View>
          <View
            className={styles.formItem}
            style={{ flex: 1, padding: 24, background: type === 'notice' ? 'rgba(37,99,235,0.08)' : '#F8FAFC', borderRadius: 12, borderWidth: 2, borderColor: type === 'notice' ? '#2563EB' : '#E2E8F0' }}
            onClick={() => setType('notice')}
          >
            <Text style={{ textAlign: 'center', color: type === 'notice' ? '#2563EB' : '#64748B' }}>ℹ️ 公告通知</Text>
          </View>
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.formTitle}>📋 通知内容</Text>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>关联实验室</Text>
          <View style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <View
              style={{ padding: '12rpx 24rpx', background: !selectedLab ? '#2563EB' : '#F1F5F9', borderRadius: 8 }}
              onClick={() => setSelectedLab('')}
            >
              <Text style={{ color: !selectedLab ? '#fff' : '#64748B', fontSize: 24 }}>全部</Text>
            </View>
            {labs.map(lab => (
              <View
                key={lab.id}
                style={{ padding: '12rpx 24rpx', background: selectedLab === lab.id ? '#2563EB' : '#F1F5F9', borderRadius: 8 }}
                onClick={() => setSelectedLab(lab.id)}
              >
                <Text style={{ color: selectedLab === lab.id ? '#fff' : '#64748B', fontSize: 24 }}>{lab.name}</Text>
              </View>
            ))}
          </View>
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>标题 *</Text>
          <Input
            className={styles.formInput}
            placeholder="请输入通知标题"
            value={title}
            onInput={(e) => setTitle(e.detail.value)}
          />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>内容 *</Text>
          <Textarea
            className={styles.formTextarea}
            placeholder="请输入通知详细内容..."
            value={content}
            onInput={(e) => setContent(e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.formTitle}>📜 历史通知</Text>
        {labNotifications.slice(0, 3).map(n => (
          <View key={n.id} className={styles.card} style={{ marginBottom: 16, padding: 24 }}>
            <View className={styles.cardHeader}>
              <Text className={styles.cardTitle} style={{ fontSize: 26 }}>{n.title}</Text>
              <Text style={{ fontSize: 20, color: '#94A3B8' }}>{new Date(n.createdAt).toLocaleDateString()}</Text>
            </View>
            <Text className={styles.cardTime}>{n.content}</Text>
          </View>
        ))}
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.btnSecondary} onClick={() => Taro.navigateBack()}>
          <Text className={styles.btnText}>取消</Text>
        </View>
        <View className={styles.btnPrimary} onClick={handleSubmit}>
          <Text className={styles.btnText}>发布通知</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default NotificationsPage;
