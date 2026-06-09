import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView, Swiper, SwiperItem } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useUserStore } from '@/store/useUserStore';
import DeviceCard from '@/components/DeviceCard';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import { devices } from '@/data/devices';
import { labNotifications } from '@/data/labs';
import { reservations } from '@/data/reservations';
import { unreadCount } from '@/data/messages';
import { getCreditLevel, formatDate } from '@/utils';
import { Device, Reservation, LabNotification } from '@/types';
import styles from './index.module.scss';

interface QuickEntry {
  icon: string;
  text: string;
  color: string;
  path: string;
}

const HomePage: React.FC = () => {
  const { user, role } = useUserStore();
  const [todayReservations, setTodayReservations] = useState<Reservation[]>([]);
  const [hotDevices, setHotDevices] = useState<Device[]>([]);
  const [notices, setNotices] = useState<LabNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUnread, setCurrentUnread] = useState(0);

  const quickEntries: QuickEntry[] = [
    { icon: '📅', text: '立即预约', color: 'blue', path: '/pages/reservation/index' },
    { icon: '📋', text: '我的预约', color: 'green', path: '/pages/reservation/index' },
    { icon: '📱', text: '扫码签到', color: 'yellow', path: '/pages/checkin/index' },
    { icon: '⭐', text: '常用设备', color: 'purple', path: '/pages/favorites/index' },
    { icon: '📊', text: '使用记录', color: 'blue', path: '/pages/records/index' },
    { icon: '💯', text: '信用分', color: 'green', path: '/pages/credit/index' },
    { icon: '📝', text: '违规申诉', color: 'yellow', path: '/pages/appeal/index' },
    { icon: '🔔', text: '消息中心', color: 'purple', path: '/pages/message/index' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(() => {
    console.log('[HomePage] 加载首页数据');
    setLoading(true);

    setTimeout(() => {
      const today = formatDate(new Date());
      const todayRes = reservations.filter(
        r => r.userId === user.id && r.date === today && r.status !== 'cancelled' && r.status !== 'rejected'
      );
      setTodayReservations(todayRes);

      setHotDevices(devices.slice(0, 4));
      setNotices(labNotifications);
      setCurrentUnread(unreadCount);
      setLoading(false);
    }, 300);
  }, [user.id]);

  const onPullDownRefresh = useCallback(() => {
    console.log('[HomePage] 下拉刷新');
    loadData();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 500);
  }, [loadData]);

  useEffect(() => {
    Taro.eventCenter.on('pulldownrefresh', onPullDownRefresh);
    return () => {
      Taro.eventCenter.off('pulldownrefresh', onPullDownRefresh);
    };
  }, [onPullDownRefresh]);

  const handleQuickEntry = (entry: QuickEntry) => {
    console.log('[HomePage] 点击快速入口:', entry.text);
    if (entry.path.startsWith('tab:')) {
      Taro.switchTab({ url: entry.path.replace('tab:', '') });
    } else {
      Taro.navigateTo({ url: entry.path });
    }
  };

  const handleCheckIn = (reservation: Reservation) => {
    console.log('[HomePage] 点击签到:', reservation.id);
    Taro.navigateTo({ url: `/pages/checkin/index?id=${reservation.id}` });
  };

  const handleViewMoreDevices = () => {
    Taro.switchTab({ url: '/pages/reservation/index' });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return '夜深了';
    if (hour < 12) return '早上好';
    if (hour < 14) return '中午好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refresherEnabled
      refresherTriggered={loading}
      onRefresherRefresh={onPullDownRefresh}
    >
      {/* 顶部用户区域 */}
      <View className={styles.header}>
        <View className={styles.userRow}>
          <Image
            className={styles.avatar}
            src={user.avatar}
            mode="aspectFill"
            onError={(e) => console.error('[HomePage] 头像加载失败:', e.detail)}
          />
          <View className={styles.userInfo}>
            <Text className={styles.greeting}>{getGreeting()}，{user.role === 'labAssistant' ? '实验员' : '同学'}</Text>
            <Text className={styles.userName}>{user.name}</Text>
            <Text className={styles.department}>{user.department}</Text>
          </View>
          {currentUnread > 0 && (
            <View style={{ position: 'relative' }}>
              <Text style={{ fontSize: '48rpx', color: '#fff' }}>🔔</Text>
              <View style={{
                position: 'absolute',
                top: '-8rpx',
                right: '-8rpx',
                minWidth: '36rpx',
                height: '36rpx',
                background: '#EF4444',
                borderRadius: '18rpx',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 8rpx'
              }}>
                <Text style={{ color: '#fff', fontSize: '20rpx', fontWeight: '600' }}>{currentUnread}</Text>
              </View>
            </View>
          )}
        </View>

        {/* 信用分卡片 */}
        <View className={styles.creditCard}>
          <View className={styles.creditItem}>
            <Text className={styles.creditValue}>{user.creditScore}</Text>
            <Text className={styles.creditLabel}>信用分</Text>
          </View>
          <View className={styles.creditDivider} />
          <View className={styles.creditItem}>
            <Text className={styles.creditValue}>{getCreditLevel(user.creditScore)}</Text>
            <Text className={styles.creditLabel}>信用等级</Text>
          </View>
          <View className={styles.creditDivider} />
          <View className={styles.creditItem}>
            <Text className={styles.creditValue}>{user.violationCount}</Text>
            <Text className={styles.creditLabel}>违规次数</Text>
          </View>
        </View>
      </View>

      {/* 公告轮播 */}
      <View className={styles.section}>
        <View className={styles.noticeCard}>
          <Text className={styles.noticeIcon}>📢</Text>
          <View className={styles.noticeContent}>
            <Swiper
              autoplay
              vertical
              interval={3000}
              displayMultipleItems={1}
              style={{ height: '48rpx' }}
            >
              {notices.map((notice) => (
                <SwiperItem key={notice.id}>
                  <Text className={styles.noticeText}>{notice.title}</Text>
                </SwiperItem>
              ))}
            </Swiper>
          </View>
        </View>
      </View>

      {/* 快速入口 */}
      <View className={styles.section}>
        <View className={styles.quickGrid}>
          {quickEntries.map((entry, index) => (
            <View
              key={index}
              className={styles.quickItem}
              onClick={() => handleQuickEntry(entry)}
            >
              <View className={`${styles.quickIcon} ${styles[entry.color]}`}>
                <Text>{entry.icon}</Text>
              </View>
              <Text className={styles.quickText}>{entry.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 今日预约 */}
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>今日预约</Text>
          <Text
            className={styles.sectionMore}
            onClick={() => Taro.switchTab({ url: '/pages/reservation/index' })}
          >
            查看全部
          </Text>
        </View>

        {todayReservations.length > 0 ? (
          todayReservations.map((reservation) => (
            <View key={reservation.id} className={styles.todayCard}>
              <View className={styles.todayHeader}>
                <Text className={styles.todayTitle}>{reservation.deviceName}</Text>
                <StatusBadge status={reservation.status} size="sm" />
              </View>
              <View className={styles.todayContent}>
                <View>
                  <Text className={styles.todayDevice}>{reservation.labName}</Text>
                  <Text className={styles.todayTime}>
                    {reservation.startTime} - {reservation.endTime} · {reservation.purpose}
                  </Text>
                </View>
                {reservation.status === 'approved' && !reservation.checkInTime && (
                  <View
                    className={styles.todayBtn}
                    onClick={() => handleCheckIn(reservation)}
                  >
                    <Text>去签到</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        ) : (
          <View className={styles.todayCard}>
            <Text className={styles.noReservation}>今天暂无预约，快去预约设备吧！</Text>
          </View>
        )}
      </View>

      {/* 热门设备 */}
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>热门设备</Text>
          <Text className={styles.sectionMore} onClick={handleViewMoreDevices}>
            更多
          </Text>
        </View>
      </View>

      <View className={styles.deviceList}>
        {hotDevices.length > 0 ? (
          hotDevices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))
        ) : (
          <EmptyState title="暂无设备数据" description="请稍后再试" />
        )}
      </View>

      {loading && (
        <View className={styles.loading}>
          <Text>加载中...</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default HomePage;
