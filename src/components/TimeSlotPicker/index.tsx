import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import { TimeSlot } from '@/types';
import styles from './index.module.scss';

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedId?: string;
  onSelect: (slot: TimeSlot) => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ slots, selectedId, onSelect }) => {
  const handleSelect = (slot: TimeSlot) => {
    if (slot.isAvailable) {
      onSelect(slot);
    }
  };

  return (
    <View className={styles.container}>
      <View className={styles.titleRow}>
        <Text className={styles.title}>选择时段</Text>
        <Text className={styles.subtitle}>点击选择可用时段</Text>
      </View>
      <View className={styles.slotsGrid}>
        {slots.map((slot) => (
          <View
            key={slot.id}
            className={classnames(
              styles.slotCard,
              selectedId === slot.id && styles.selected,
              !slot.isAvailable && styles.disabled
            )}
            onClick={() => handleSelect(slot)}
          >
            <View className={styles.timeRow}>
              <Text className={styles.timeText}>{slot.startTime}</Text>
              <Text className={styles.dash}>-</Text>
              <Text className={styles.timeText}>{slot.endTime}</Text>
            </View>
            <View className={styles.statusRow}>
              <Text className={classnames(
                styles.statusText,
                slot.isAvailable ? styles.available : styles.full
              )}>
                {slot.isAvailable ? `${slot.reserved}/${slot.capacity}人` : '已满'}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default TimeSlotPicker;
