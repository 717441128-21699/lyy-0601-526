import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Picker, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { useUserStore } from '@/store/useUserStore';
import DeviceCard from '@/components/DeviceCard';
import LabCard from '@/components/LabCard';
import ReservationCard from '@/components/ReservationCard';
import EmptyState from '@/components/EmptyState';
import StatusBadge from '@/components/StatusBadge';
import { labs, getLabs } from '@/data/labs';
import { devices, deviceTypes } from '@/data/devices';
import { reservations } from '@/data/reservations';
import { formatDate, getStatusText } from '@/utils';
import { Device, Lab, Reservation, DeviceType, FilterOptions } from '@/types';
import styles from './index.module.scss';

type TabType = 'device' | 'lab' | 'my' | 'audit';

const ReservationPage: React.FC = () => {
  const { user, role } = useUserStore();
  const [activeTab, setActiveTab] = useState<TabType>('device');
  const [selectedLab, setSelectedLab] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [deviceList, setDeviceList] = useState<Device[]>([]);
  const [labList, setLabList] = useState<Lab[]>([]);
  const [myReservations, setMyReservations] = useState<Reservation[]>([]);
  const [pendingReservations, setPendingReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  const dateRange = Array.from({ length: 7 }, (_, i) => {
    const date = dayjs().add(i, 'day');
    return {
      value: date.format('YYYY-MM-DD'),
      label: i === 0 ? '今天' : i === 1 ? '明天' : date.format('MM-DD'),
    };
  });

  const tabs: { key: TabType; label: string }[] = role === 'labAssistant'
    ? [
        { key: 'device', label: '设备预约' },
        { key: 'lab', label: '实验室' },
        { key: 'my', label: '我的预约' },
        { key: 'audit', label: '待审核' },
      ]
    : [
        { key: 'device', label: '设备预约' },
        { key: 'lab', label: '实验室' },
        { key: 'my', label: '我的预约' },
      ];

  useEffect(() => {
    loadData();
  }, [activeTab, selectedLab, selectedType, selectedDate, role, user.id]);

  const loadData = useCallback(() => {
    console.log('[ReservationPage] 加载数据, tab:', activeTab);
    setLoading(true);

    setTimeout(() => {
      if (activeTab === 'device') {
        let filtered = [...devices];
        if (selectedLab) {
          filtered = filtered.filter(d => d.labId === selectedLab);
        }
        if (selectedType) {
          filtered = filtered.filter(d => d.type === selectedType);
        }
        setDeviceList(filtered);
      } else if (activeTab === 'lab') {
        setLabList(labs);
      } else if (activeTab === 'my') {
        const myRes = reservations.filter(r => r.userId === user.id);
        setMyReservations(myRes);
      } else if (activeTab === 'audit') {
        const pending = reservations.filter(r => r.status === 'pending');
        setPendingReservations(pending);
      }
      setLoading(false);
    }, 300);
  }, [activeTab, selectedLab, selectedType, user.id]);

  const handleFilterChange = (type: 'lab' | 'type' | 'date', value: string) => {
    console.log('[ReservationPage] 筛选变更:', type, value);
    if (type === 'lab') setSelectedLab(value);
    if (type === 'type') setSelectedType(value);
    if (type === 'date') setSelectedDate(value);
  };

  const handleTypeClick = (typeValue: string) => {
    setSelectedType(selectedType === typeValue ? '' : typeValue);
  };

  const handleDeviceClick = (deviceId: string) => {
    Taro.navigateTo({
      url: `/pages/device-detail/index?id=${deviceId}`
    });
  };

  const handleLabClick = (lab: Lab) => {
    setSelectedLab(lab.id);
    setActiveTab('device');
  };

  const handleCancelReservation = async (reservationId: string) => {
    Taro.showModal({
      title: '确认取消',
      content: '确定要取消这个预约吗？',
      success: async (res) => {
        if (res.confirm) {
          console.log('[ReservationPage] 取消预约:', reservationId);
          Taro.showToast({ title: '取消成功', icon: 'success' });
          loadData();
        }
      }
    });
  };

  const handleAudit = async (reservationId: string, status: 'approved' | 'rejected') => {
    const action = status === 'approved' ? '通过' : '拒绝';
    Taro.showModal({
      title: `确认${action}`,
      content: `确定要${action}这个预约申请吗？`,
      success: async (res) => {
        if (res.confirm) {
          console.log('[ReservationPage] 审核预约:', reservationId, status);
          Taro.showToast({ title: `${action}成功`, icon: 'success' });
          loadData();
        }
      }
    });
  };

  const renderFilterBar = () => {
    if (activeTab !== 'device') return null;

    return (
      <>
        <View className={styles.filterBar}>
          <View className={styles.filterRow}>
            <View className={styles.filterItem}>
              <Text className={styles.filterLabel}>实验室</Text>
              <Picker
                mode="selector"
                range={[{ id: '', name: '全部' }, ...labs]}
                rangeKey="name"
                value={labs.findIndex(l => l.id === selectedLab) + 1}
                onChange={(e) => {
                  const index = parseInt(e.detail.value);
                  handleFilterChange('lab', index === 0 ? '' : labs[index - 1].id);
                }}
              >
                <View className={classnames(styles.picker, selectedLab && styles.active)}>
                  <Text className={styles.pickerText}>
                    {selectedLab ? labs.find(l => l.id === selectedLab)?.name : '全部实验室'}
                  </Text>
                  <Text className={styles.pickerArrow}>▼</Text>
                </View>
              </Picker>
            </View>
            <View className={styles.filterItem}>
              <Text className={styles.filterLabel}>预约日期</Text>
              <Picker
                mode="selector"
                range={dateRange}
                rangeKey="label"
                value={dateRange.findIndex(d => d.value === selectedDate)}
                onChange={(e) => {
                  const index = parseInt(e.detail.value);
                  handleFilterChange('date', dateRange[index].value);
                }}
              >
                <View className={classnames(styles.picker, selectedDate && styles.active)}>
                  <Text className={styles.pickerText}>
                    {dateRange.find(d => d.value === selectedDate)?.label || '选择日期'}
                  </Text>
                  <Text className={styles.pickerArrow}>▼</Text>
                </View>
              </Picker>
            </View>
          </View>
        </View>

        <ScrollView className={styles.typeScroll} scrollX showScrollbar={false}>
          <View
            className={classnames(styles.typeTag, !selectedType && styles.active)}
            onClick={() => handleTypeClick('')}
          >
            <Text className={styles.typeText}>全部</Text>
          </View>
          {deviceTypes.map((type: DeviceType) => (
            <View
              key={type.value}
              className={classnames(styles.typeTag, selectedType === type.value && styles.active)}
              onClick={() => handleTypeClick(type.value)}
            >
              <Text className={styles.typeText}>{type.label}</Text>
            </View>
          ))}
        </ScrollView>
      </>
    );
  };

  const renderAuditPanel = () => {
    if (role !== 'labAssistant') return null;

    const pendingCount = pendingReservations.length;
    const todayCount = reservations.filter(
      r => r.date === formatDate(new Date()) && r.status === 'approved'
    ).length;

    return (
      <>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>实验员面板</Text>
        </View>
        <View className={styles.statsRow}>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{pendingCount}</Text>
            <Text className={styles.statLabel}>待审核</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{todayCount}</Text>
            <Text className={styles.statLabel}>今日预约</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{labs.filter(l => l.status === 'open').length}</Text>
            <Text className={styles.statLabel}>开放实验室</Text>
          </View>
        </View>
        <View className={styles.quickActions}>
          <View
            className={styles.actionBtn}
            onClick={() => Taro.navigateTo({ url: '/pages/schedule/index' })}
          >
            <Text className={styles.actionBtnText}>📅 今日排班</Text>
          </View>
          <View
            className={styles.actionBtn}
            onClick={() => Taro.navigateTo({ url: '/pages/audit/index' })}
          >
            <Text className={styles.actionBtnText}>✅ 批量审核</Text>
          </View>
        </View>
      </>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View className={styles.loading}>
          <Text>加载中...</Text>
        </View>
      );
    }

    if (activeTab === 'device') {
      return (
        <View className={styles.listContainer}>
          {deviceList.length > 0 ? (
            deviceList.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                onClick={() => handleDeviceClick(device.id)}
              />
            ))
          ) : (
            <EmptyState
              icon="🔍"
              title="暂无符合条件的设备"
              description="试试调整筛选条件吧"
            />
          )}
        </View>
      );
    }

    if (activeTab === 'lab') {
      return (
        <View className={styles.labList}>
          {labList.map((lab) => (
            <LabCard
              key={lab.id}
              lab={lab}
              onClick={() => handleLabClick(lab)}
              selected={selectedLab === lab.id}
            />
          ))}
        </View>
      );
    }

    if (activeTab === 'my') {
      return (
        <View className={styles.listContainer}>
          {myReservations.length > 0 ? (
            myReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onCancel={() => handleCancelReservation(reservation.id)}
              />
            ))
          ) : (
            <EmptyState
              icon="📅"
              title="暂无预约记录"
              description="快去预约你需要的设备吧"
            />
          )}
        </View>
      );
    }

    if (activeTab === 'audit' && role === 'labAssistant') {
      return (
        <View className={styles.auditPanel}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>待审核申请</Text>
            <Text className={styles.sectionCount}>{pendingReservations.length}条</Text>
          </View>
          {pendingReservations.length > 0 ? (
            pendingReservations.map((reservation) => (
              <View key={reservation.id} className="card">
                <View className="flexBetween" style={{ marginBottom: 16 }}>
                  <View>
                    <Text style={{ fontSize: 30, fontWeight: 600 }}>{reservation.deviceName}</Text>
                    <Text style={{ fontSize: 24, color: '#64748B' }}>{reservation.userName} · {reservation.labName}</Text>
                  </View>
                  <StatusBadge status={reservation.status} />
                </View>
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 26, color: '#64748B' }}>
                    {reservation.date} {reservation.startTime}-{reservation.endTime}
                  </Text>
                  <Text style={{ fontSize: 26, color: '#64748B' }}>用途：{reservation.purpose}</Text>
                </View>
                <View className="flex" style={{ gap: 16, justifyContent: 'flex-end' }}>
                  <View
                    className="btnSecondary"
                    style={{ height: 64, padding: '0 32rpx' }}
                    onClick={() => handleAudit(reservation.id, 'rejected')}
                  >
                    <Text style={{ color: '#EF4444' }}>拒绝</Text>
                  </View>
                  <View
                    className="btnPrimary"
                    style={{ height: 64, padding: '0 32rpx' }}
                    onClick={() => handleAudit(reservation.id, 'approved')}
                  >
                    <Text>通过</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <EmptyState
              icon="✅"
              title="暂无待审核申请"
              description="所有预约申请都已处理完毕"
            />
          )}
        </View>
      );
    }

    return null;
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
      {role === 'labAssistant' && renderAuditPanel()}

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

      {renderFilterBar()}
      {renderContent()}
    </ScrollView>
  );
};

export default ReservationPage;
