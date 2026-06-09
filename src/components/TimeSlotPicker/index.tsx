import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import { TimeSlot } from '@/types';
import styles from './index.module.scss';

interface TimeSlotPickerProps {
  timeSlots: TimeSlot[];
  selectedSlots?: string[];
  disabledSlots?: string[];
  onSelect: (slotIds: string[]) => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ 
  timeSlots, 
  selectedSlots = [], 
  disabledSlots = [], 
  onSelect 
}) => {
  const handleSlotClick = (slot: TimeSlot) => {
    const isDisabled = disabledSlots.includes(slot.id) || !slot.isAvailable;
    if (isDisabled) return;

    const isSelected = selectedSlots.includes(slot.id);
    let newSelected: string[];
    
    if (isSelected) {
      newSelected = selectedSlots.filter(id => id !== slot.id);
    } else {
      newSelected = [...selectedSlots, slot.id];
    }
    
    onSelect(newSelected);
  };

  const isSlotDisabled = (slot: TimeSlot) => {
    return disabledSlots.includes(slot.id) || !slot.isAvailable;
  };

  return (
    <View className={styles.container}>
      <View className={styles.slotsGrid}>
        {timeSlots.map((slot) => {
          const disabled = isSlotDisabled(slot);
          const selected = selectedSlots.includes(slot.id);
          
          return (
            <View
              key={slot.id}
              className={classnames(
                styles.slotCard,
                selected && styles.selected,
                disabled && styles.disabled
              )}
              onClick={() => handleSlotClick(slot)}
            >
              <View className={styles.timeRow}>
                <Text className={styles.timeText}>{slot.startTime}</Text>
                <Text className={styles.dash}>-</Text>
                <Text className={styles.timeText}>{slot.endTime}</Text>
              </View>
              <View className={styles.statusRow}>
                <Text className={classnames(
                  styles.statusText,
                  disabled ? styles.full : styles.available
                )}>
                  {disabled ? '不可用' : `${slot.reserved}/${slot.capacity}人`}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default TimeSlotPicker;
