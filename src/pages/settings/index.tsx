import React from 'react';
import { View, Text, ScrollView, Switch } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from '../common.module.scss';

const SettingsPage: React.FC = () => {
  const menuItems = [
    { icon: '🔔', title: '消息通知', desc: '预约提醒、审核结果等', type: 'switch', value: true },
    { icon: '🔒', title: '隐私设置', desc: '个人信息和位置权限', type: 'arrow' },
    { icon: '📱', title: '账号安全', desc: '密码修改、绑定手机', type: 'arrow' },
    { icon: '🎯', title: '偏好设置', desc: '常用设备、默认实验室', type: 'arrow' },
    { icon: '💾', title: '清除缓存', desc: '当前缓存 23.5MB', type: 'action', action: 'clearCache' },
    { icon: 'ℹ️', title: '关于', desc: '版本 v1.0.0', type: 'arrow' },
  ];

  const handleAction = (action: string) => {
    if (action === 'clearCache') {
      Taro.showModal({
        title: '清除缓存',
        content: '确定要清除本地缓存吗？',
        success: (res) => {
          if (res.confirm) {
            Taro.showToast({ title: '缓存已清除', icon: 'success' });
          }
        }
      });
    }
  };

  const handleLogout = () => {
    Taro.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已退出登录', icon: 'success' });
        }
      }
    });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.listContainer}>
        {menuItems.map((item, idx) => (
          <View key={idx} className={styles.listItem}>
            <View className={styles.itemLeft}>
              <View className={`${styles.itemIcon} ${idx % 4 === 0 ? styles.iconBlue : idx % 4 === 1 ? styles.iconGreen : idx % 4 === 2 ? styles.iconYellow : styles.iconRed}`}>
                <Text>{item.icon}</Text>
              </View>
              <View className={styles.itemContent}>
                <Text className={styles.itemTitle}>{item.title}</Text>
                <Text className={styles.itemDesc}>{item.desc}</Text>
              </View>
            </View>
            {item.type === 'switch' && <Switch color="#2563EB" checked={item.value} />}
            {item.type === 'arrow' && <View className={styles.itemArrow} />}
            {item.type === 'action' && (
              <Text style={{ color: '#2563EB', fontSize: 24 }} onClick={() => handleAction(item.action || '')}>清除</Text>
            )}
          </View>
        ))}
      </View>

      <View style={{ padding: 32 }}>
        <View
          style={{
            height: 88,
            background: '#FEE2E2',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={handleLogout}
        >
          <Text style={{ color: '#EF4444', fontSize: 28, fontWeight: 600 }}>退出登录</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SettingsPage;
