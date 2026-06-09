import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import EmptyState from '@/components/EmptyState';
import { todaySchedule } from '@/data/reservations';
import styles from '../common.module.scss';

const SchedulePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <ScrollView className={styles.page} scrollY>
      <ScrollView className={styles.datePicker} scrollX showScrollbar={false}>
        {dates.map(date => {
          const d = new Date(date);
          return (
            <View
              key={date}
              className={`${styles.dateItem} ${selectedDate === date ? styles.active : ''}`}
              onClick={() => setSelectedDate(date)}
            >
              <Text className={styles.dateWeek}>周{weekDays[d.getDay()]}</Text>
              <Text className={styles.dateDay}>{d.getDate()}</Text>
            </View>
          );
        })}
      </ScrollView>

      <View className={styles.listContainer}>
        {todaySchedule.length > 0 ? todaySchedule.map(item => (
          <View key={item.id} className={styles.card}>
            <View className={styles.cardHeader}>
              <Text className={styles.cardTitle}>{item.labName}</Text>
              <Text className={styles.cardTime}>{item.startTime}-{item.endTime}</Text>
            </View>
            <Text className={styles.cardSubtitle}>今日待审核: {item.pendingCount}份</Text>
            <Text className={styles.cardSubtitle}>未签到: {item.noCheckInCount}人</Text>
          </View>
        )) : (
          <EmptyState icon="📅" title="暂无排班" description="今天没有排班安排" />
        )}
      </View>
    </ScrollView>
  );
};

export default SchedulePage;
