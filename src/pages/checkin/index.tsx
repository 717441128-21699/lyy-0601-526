import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useUserStore } from '@/store/useUserStore';
import ReservationCard from '@/components/ReservationCard';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import EmptyState from '@/components/EmptyState';
import StatusBadge from '@/components/StatusBadge';
import { reservations } from '@/data/reservations';
import { formatDate, getStatusText } from '@/utils';
import { Reservation } from '@/types';
import styles from './index.module.scss';

type TabType = 'current' | 'pending' | 'history';

const CheckinPage: React.FC = () => {
  const { user, role } = useUserStore();
  const [activeTab, setActiveTab] = useState<TabType>('current');
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);
  const [pendingList, setPendingList] = useState<Reservation[]>([]);
  const [historyList, setHistoryList] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedCheckinId, setSelectedCheckinId] = useState<string>('');

  const tabs: { key: TabType; label: string }[] = [
    { key: 'current', label: '使用中' },
    { key: 'pending', label: '待签到' },
    { key: 'history', label: '历史记录' },
  ];

  useEffect(() => {
    loadData();
  }, [activeTab, user.id]);

  const loadData = useCallback(() => {
    console.log('[CheckinPage] 加载数据, tab:', activeTab);
    setLoading(true);

    setTimeout(() => {
      const today = formatDate(new Date());
      const userReservations = reservations.filter(r => r.userId === user.id);

      const current = userReservations.find(
        r => r.status === 'approved' && r.checkInTime && !r.checkOutTime
      );
      setCurrentReservation(current || null);

      const pending = userReservations.filter(
        r => r.status === 'approved' && !r.checkInTime
      );
      setPendingList(pending);

      const history = userReservations.filter(
        r => ['completed', 'noShow', 'cancelled', 'rejected'].includes(r.status)
      );
      setHistoryList(history);

      setLoading(false);
    }, 300);
  }, [activeTab, user.id]);

  const handleCheckIn = async (reservation: Reservation) => {
    console.log('[CheckinPage] 签到:', reservation.id);
    setSelectedCheckinId(reservation.id);
    setShowQRCode(true);
  };

  const handleCheckOut = (reservation: Reservation) => {
    console.log('[CheckinPage] 签退:', reservation.id);
    Taro.navigateTo({
      url: `/pages/checkout-feedback/index?id=${reservation.id}`
    });
  };

  const handleConfirmCheckIn = async () => {
    Taro.showModal({
      title: '确认签到',
      content: '确定要完成签到吗？请确保已到达实验室。',
      success: async (res) => {
        if (res.confirm) {
          console.log('[CheckinPage] 确认签到:', selectedCheckinId);
          const idx = reservations.findIndex(r => r.id === selectedCheckinId);
          if (idx !== -1) {
            const now = new Date();
            const checkInTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            reservations[idx].checkInTime = checkInTime;
            reservations[idx].status = 'approved';
            console.log('[CheckinPage] 更新签到时间:', checkInTime);
            
            const updatedReservation = reservations[idx];
            setCurrentReservation(updatedReservation);
          }
          Taro.showToast({ title: '签到成功', icon: 'success' });
          setShowQRCode(false);
          setSelectedCheckinId('');
          setActiveTab('current');
          loadData();
        }
      }
    });
  };

  const renderCurrent = () => {
    if (!currentReservation) {
      return (
        <EmptyState
          icon="⏰"
          title="当前没有使用中的设备"
          description="快去预约你需要的设备吧"
        />
      );
    }

    return (
      <View className={styles.section}>
        <View className={styles.currentCard}>
          <View className={styles.currentHeader}>
            <Text className={styles.currentDevice}>{currentReservation.deviceName}</Text>
            <Text className={styles.currentStatus}>使用中</Text>
          </View>
          <View className={styles.currentInfo}>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>实验室</Text>
              <Text className={styles.infoValue}>{currentReservation.labName}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>预约时段</Text>
              <Text className={styles.infoValue}>{currentReservation.date} {currentReservation.startTime}-{currentReservation.endTime}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>签到时间</Text>
              <Text className={styles.infoValue}>{currentReservation.checkInTime}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>用途</Text>
              <Text className={styles.infoValue}>{currentReservation.purpose}</Text>
            </View>
          </View>
          <View className={styles.actionBtns}>
            <View
              className={classnames(styles.actionBtn, styles.primaryBtn)}
              onClick={() => handleCheckOut(currentReservation)}
            >
              <Text className={styles.btnText}>签退并填写反馈</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderPending = () => {
    if (pendingList.length === 0) {
      return (
        <EmptyState
          icon="📋"
          title="暂无待签到的预约"
          description="你可以在预约页面预约设备"
        />
      );
    }

    return (
      <View className={styles.listContainer}>
        {pendingList.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            onCheckIn={() => handleCheckIn(reservation)}
          />
        ))}
      </View>
    );
  };

  const renderHistory = () => {
    if (historyList.length === 0) {
      return (
        <EmptyState
          icon="📊"
          title="暂无历史记录"
          description="完成使用后会在这里显示"
        />
      );
    }

    return (
      <View className={styles.listContainer}>
        {historyList.map((reservation) => (
          <View key={reservation.id} className={styles.historyItem}>
            <View className={styles.historyHeader}>
              <Text className={styles.historyDevice}>{reservation.deviceName}</Text>
              <StatusBadge status={reservation.status} size="sm" />
            </View>
            <Text className={styles.historyInfo}>{reservation.labName}</Text>
            <Text className={styles.historyInfo}>
              {reservation.date} {reservation.startTime}-{reservation.endTime} · {reservation.purpose}
            </Text>
            {reservation.checkInTime && (
              <Text className={styles.historyTime}>
                签到: {reservation.checkInTime} {reservation.checkOutTime && `| 签退: ${reservation.checkOutTime}`}
              </Text>
            )}
            {reservation.usageResult && (
              <Text className={styles.historyTime}>使用结果: {reservation.usageResult}</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderQRCodeModal = () => {
    if (!showQRCode || !selectedCheckinId) return null;

    const targetReservation = pendingList.find(r => r.id === selectedCheckinId);
    if (!targetReservation) return null;

    return (
      <View
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
        onClick={() => setShowQRCode(false)}
      >
        <View
          style={{
            background: '#fff',
            borderRadius: 24,
            padding: 48,
            margin: 32,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <View style={{ textAlign: 'center', marginBottom: 32 }}>
            <Text style={{ fontSize: 32, fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>
              {targetReservation.deviceName}
            </Text>
            <Text style={{ fontSize: 24, color: '#64748B' }}>
              {targetReservation.labName} · {targetReservation.startTime}-{targetReservation.endTime}
            </Text>
          </View>
          <QRCodeDisplay
            reservationId={targetReservation.id}
            userId={user.id}
            size={400}
          />
          <View
            className={classnames(styles.actionBtn, styles.primaryBtn)}
            style={{ marginTop: 32 }}
            onClick={() => handleConfirmCheckIn()}
          >
            <Text className={styles.btnText}>完成签到</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refresherEnabled
      refresherTriggered={loading}
      onRefresherRefresh={() => {
        loadData();
        setTimeout(() => Taro.stopPullDownRefresh(), 500);
      }}
    >
      <View className={styles.tabBar}>
        {tabs.map((tab) => (
          <View
            key={tab.key}
            className={classnames(styles.tabItem, activeTab === tab.key && styles.active)}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text className={styles.tabText}>{tab.label}</Text>
          </View>
        ))}
      </View>

      {loading ? (
        <View className={styles.loading}>
          <Text>加载中...</Text>
        </View>
      ) : (
        <>
          {activeTab === 'current' && renderCurrent()}
          {activeTab === 'pending' && renderPending()}
          {activeTab === 'history' && renderHistory()}
        </>
      )}

      {renderQRCodeModal()}
    </ScrollView>
  );
};

export default CheckinPage;
