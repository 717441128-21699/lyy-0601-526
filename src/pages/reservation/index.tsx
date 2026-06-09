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

type AuditTabType = 'pending' | 'approved' | 'rejected';

const ReservationPage: React.FC = () => {
  const { user, role } = useUserStore();
  const [activeTab, setActiveTab] = useState<TabType>('device');
  const [auditTab, setAuditTab] = useState<AuditTabType>('pending');
  const [selectedLab, setSelectedLab] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [deviceList, setDeviceList] = useState<Device[]>([]);
  const [labList, setLabList] = useState<Lab[]>([]);
  const [myReservations, setMyReservations] = useState<Reservation[]>([]);
  const [pendingReservations, setPendingReservations] = useState<Reservation[]>([]);
  const [approvedReservations, setApprovedReservations] = useState<Reservation[]>([]);
  const [rejectedReservations, setRejectedReservations] = useState<Reservation[]>([]);
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
  }, [activeTab, selectedLab, selectedType, selectedDate, role, user.id, auditTab]);

  const loadData = useCallback(() => {
    console.log('[ReservationPage] 加载数据, tab:', activeTab, 'auditTab:', auditTab);
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
        const approved = reservations.filter(r => r.status === 'approved');
        const rejected = reservations.filter(r => r.status === 'rejected');
        setPendingReservations(pending);
        setApprovedReservations(approved);
        setRejectedReservations(rejected);
      }
      setLoading(false);
    }, 300);
  }, [activeTab, selectedLab, selectedType, user.id, auditTab]);

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
          const idx = reservations.findIndex(r => r.id === reservationId);
          if (idx !== -1) {
            reservations[idx].status = 'cancelled';
          }
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
          
          const idx = reservations.findIndex(r => r.id === reservationId);
          if (idx !== -1) {
            reservations[idx].status = status;
            reservations[idx].auditor = '李实验员';
            reservations[idx].auditRemark = status === 'approved' ? '审核通过，请按时到达' : '审核拒绝，请选择其他时段';
          }
          
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
      const auditTabs: { key: AuditTabType; label: string }[] = [
        { key: 'pending', label: '待审核' },
        { key: 'approved', label: '已通过' },
        { key: 'rejected', label: '已拒绝' },
      ];

      const getCurrentList = () => {
        switch (auditTab) {
          case 'pending': return pendingReservations;
          case 'approved': return approvedReservations;
          case 'rejected': return rejectedReservations;
          default: return [];
        }
      };

      const currentList = getCurrentList();

      const getEmptyState = () => {
        switch (auditTab) {
          case 'pending':
            return { icon: '✅', title: '暂无待审核申请', desc: '所有预约申请都已处理完毕' };
          case 'approved':
            return { icon: '📋', title: '暂无已通过申请', desc: '还没有通过的预约申请' };
          case 'rejected':
            return { icon: '❌', title: '暂无已拒绝申请', desc: '还没有拒绝的预约申请' };
          default:
            return { icon: '📋', title: '暂无数据', desc: '' };
        }
      };

      const emptyState = getEmptyState();

      return (
        <View className={styles.auditPanel}>
          <View className={styles.auditTabs}>
            {auditTabs.map((tab) => (
              <View
                key={tab.key}
                className={classnames(styles.auditTabItem, auditTab === tab.key && styles.auditTabActive)}
                onClick={() => setAuditTab(tab.key)}
              >
                <Text className={styles.auditTabText}>{tab.label}</Text>
                <Text className={styles.auditTabCount}>
                  {tab.key === 'pending' ? pendingReservations.length :
                   tab.key === 'approved' ? approvedReservations.length :
                   rejectedReservations.length}
                </Text>
              </View>
            ))}
          </View>

          {currentList.length > 0 ? (
            currentList.map((reservation) => (
              <View key={reservation.id} className={styles.auditCard}>
                <View className={styles.auditCardHeader}>
                  <View>
                    <Text className={styles.auditDeviceName}>{reservation.deviceName}</Text>
                    <Text className={styles.auditDeviceInfo}>{reservation.userName} · {reservation.labName}</Text>
                  </View>
                  <StatusBadge status={reservation.status} />
                </View>
                <View className={styles.auditCardBody}>
                  <Text className={styles.auditCardText}>
                    📅 {reservation.date} {reservation.startTime}-{reservation.endTime}
                  </Text>
                  <Text className={styles.auditCardText}>📝 用途：{reservation.purpose}</Text>
                  {reservation.auditRemark && (
                    <Text className={styles.auditRemark}>💬 {reservation.auditRemark}</Text>
                  )}
                </View>
                {auditTab === 'pending' && (
                  <View className={styles.auditCardActions}>
                    <View
                      className={styles.auditBtnReject}
                      onClick={() => handleAudit(reservation.id, 'rejected')}
                    >
                      <Text className={styles.auditBtnRejectText}>拒绝</Text>
                    </View>
                    <View
                      className={styles.auditBtnApprove}
                      onClick={() => handleAudit(reservation.id, 'approved')}
                    >
                      <Text className={styles.auditBtnApproveText}>通过</Text>
                    </View>
                  </View>
                )}
              </View>
            ))
          ) : (
            <EmptyState
              icon={emptyState.icon}
              title={emptyState.title}
              description={emptyState.desc}
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
