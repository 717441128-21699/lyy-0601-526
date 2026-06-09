import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import EmptyState from '@/components/EmptyState';
import StatusBadge from '@/components/StatusBadge';
import { scheduleList, reservations } from '@/data/reservations';
import { useUserStore } from '@/store/useUserStore';
import styles from './index.module.scss';

const SchedulePage: React.FC = () => {
  const { user } = useUserStore();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const daySchedules = useMemo(() => {
    return scheduleList.filter(s => s.date === selectedDate && s.assistantId === 'a001');
  }, [selectedDate]);

  const totalStats = useMemo(() => {
    const dayReservations = reservations.filter(r => r.date === selectedDate);
    return {
      pending: dayReservations.filter(r => r.status === 'pending').length,
      approved: dayReservations.filter(r => r.status === 'approved').length,
      noCheckIn: dayReservations.filter(r => r.status === 'approved' && !r.checkInTime).length,
    };
  }, [selectedDate]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${month}月${day}日`;
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.statsBar}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{totalStats.pending}</Text>
          <Text className={styles.statLabel}>待审核</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{totalStats.approved}</Text>
          <Text className={styles.statLabel}>已通过</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{totalStats.noCheckIn}</Text>
          <Text className={styles.statLabel}>未签到</Text>
        </View>
      </View>

      <ScrollView className={styles.datePicker} scrollX showScrollbar={false}>
        {dates.map(date => {
          const d = new Date(date);
          return (
            <View
              key={date}
              className={classnames(styles.dateItem, selectedDate === date && styles.active)}
              onClick={() => setSelectedDate(date)}
            >
              <Text className={styles.dateWeek}>周{weekDays[d.getDay()]}</Text>
              <Text className={styles.dateDay}>{d.getDate()}</Text>
            </View>
          );
        })}
      </ScrollView>

      <View className={styles.dateHeader}>
        <Text className={styles.dateTitle}>{formatDate(selectedDate)} 排班</Text>
      </View>

      <View className={styles.listContainer}>
        {daySchedules.length > 0 ? (
          daySchedules.map(schedule => (
            <View key={schedule.id} className={styles.card}>
              <View className={styles.cardHeader}>
                <View className={styles.cardHeaderLeft}>
                  <Text className={styles.cardTitle}>🏢 {schedule.labName}</Text>
                  <Text className={styles.cardTime}>⏰ {schedule.startTime}-{schedule.endTime}</Text>
                </View>
                <View className={styles.badgeRow}>
                  <View className={styles.badgeOrange}>
                    <Text>待审 {schedule.pendingCount}</Text>
                  </View>
                </View>
              </View>

              <View className={styles.statsRow}>
                <View className={styles.statBox}>
                  <Text className={styles.statBoxValue} style={{ color: '#10B981' }}>{schedule.approvedCount}</Text>
                  <Text className={styles.statBoxLabel}>已通过预约</Text>
                </View>
                <View className={styles.statBox}>
                  <Text className={styles.statBoxValue} style={{ color: '#F59E0B' }}>{schedule.noCheckInCount}</Text>
                  <Text className={styles.statBoxLabel}>未签到</Text>
                </View>
                <View className={styles.statBox}>
                  <Text className={styles.statBoxValue} style={{ color: '#2563EB' }}>{schedule.pendingCount}</Text>
                  <Text className={styles.statBoxLabel}>待处理</Text>
                </View>
              </View>

              {schedule.noCheckInList.length > 0 && (
                <View className={styles.noCheckInSection}>
                  <Text className={styles.sectionLabel}>⚠️ 未签到名单</Text>
                  {schedule.noCheckInList.map(r => (
                    <View key={r.id} className={styles.noCheckInItem}>
                      <View className={styles.noCheckInInfo}>
                        <Text className={styles.noCheckInName}>{r.userName}</Text>
                        <Text className={styles.noCheckInDevice}>{r.deviceName} · {r.startTime}-{r.endTime}</Text>
                      </View>
                      <StatusBadge status={r.status} size="sm" />
                    </View>
                  ))}
                </View>
              )}

              {schedule.reservations.length > 0 && (
                <View className={styles.reservationsSection}>
                  <Text className={styles.sectionLabel}>📋 今日预约</Text>
                  {schedule.reservations.slice(0, 3).map(r => (
                    <View key={r.id} className={styles.reservationItem}>
                      <View className={styles.reservationInfo}>
                        <Text className={styles.reservationName}>{r.userName}</Text>
                        <Text className={styles.reservationDevice}>{r.deviceName} · {r.startTime}-{r.endTime}</Text>
                      </View>
                      <StatusBadge status={r.status} size="sm" />
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        ) : (
          <EmptyState
            icon="📅"
            title="暂无排班"
            description={`${formatDate(selectedDate)}没有排班安排`}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default SchedulePage;
