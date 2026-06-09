import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { Reservation } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import { formatDate, formatTimeSlot } from '@/utils';
import styles from './index.module.scss';

interface ReservationCardProps {
  reservation: Reservation;
  showActions?: boolean;
  onCheckIn?: () => void;
  onCheckOut?: () => void;
  onCancel?: () => void;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  showActions = true,
  onCheckIn,
  onCheckOut,
  onCancel
}) => {
  const handleCardClick = () => {
    console.log('[ReservationCard] 点击预约:', reservation.id);
  };

  const renderActions = () => {
    if (!showActions) return null;

    if (reservation.status === 'approved' && !reservation.checkInTime) {
      return (
        <View className={styles.actions}>
          <View
            className={classnames(styles.btn, styles.btnPrimary)}
            onClick={(e) => {
              e.stopPropagation();
              onCheckIn?.();
            }}
          >
            <Text className={styles.btnText}>签到</Text>
          </View>
          <View
            className={classnames(styles.btn, styles.btnSecondary)}
            onClick={(e) => {
              e.stopPropagation();
              onCancel?.();
            }}
          >
            <Text className={styles.btnTextSecondary}>取消</Text>
          </View>
        </View>
      );
    }

    if (reservation.status === 'approved' && reservation.checkInTime && !reservation.checkOutTime) {
      return (
        <View className={styles.actions}>
          <View
            className={classnames(styles.btn, styles.btnPrimary)}
            onClick={(e) => {
              e.stopPropagation();
              onCheckOut?.();
            }}
          >
            <Text className={styles.btnText}>签退</Text>
          </View>
        </View>
      );
    }

    if (reservation.status === 'pending') {
      return (
        <View className={styles.actions}>
          <View
            className={classnames(styles.btn, styles.btnSecondary)}
            onClick={(e) => {
              e.stopPropagation();
              onCancel?.();
            }}
          >
            <Text className={styles.btnTextSecondary}>取消预约</Text>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <View className={styles.card} onClick={handleCardClick}>
      <View className={styles.header}>
        <View className={styles.titleRow}>
          <Text className={styles.deviceName}>{reservation.deviceName}</Text>
          <StatusBadge status={reservation.status} size="sm" />
        </View>
        <Text className={styles.labName}>{reservation.labName}</Text>
      </View>

      <View className={styles.infoGrid}>
        <View className={styles.infoItem}>
          <Text className={styles.label}>日期</Text>
          <Text className={styles.value}>{formatDate(reservation.date, 'YYYY年MM月DD日')}</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.label}>时段</Text>
          <Text className={styles.value}>{formatTimeSlot(reservation.startTime, reservation.endTime)}</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.label}>用途</Text>
          <Text className={styles.value}>{reservation.purpose}</Text>
        </View>
        {reservation.checkInTime && (
          <View className={styles.infoItem}>
            <Text className={styles.label}>签到</Text>
            <Text className={styles.value}>{reservation.checkInTime}</Text>
          </View>
        )}
        {reservation.checkOutTime && (
          <View className={styles.infoItem}>
            <Text className={styles.label}>签退</Text>
            <Text className={styles.value}>{reservation.checkOutTime}</Text>
          </View>
        )}
        {reservation.teamMembers?.length > 0 && (
          <View className={styles.infoItem}>
            <Text className={styles.label}>组员</Text>
            <Text className={styles.value}>
              {reservation.teamMembers.map(m => m.name).join('、')}
            </Text>
          </View>
        )}
      </View>

      {reservation.auditRemark && (
        <View className={styles.remark}>
          <Text className={styles.remarkLabel}>备注：</Text>
          <Text className={styles.remarkText}>{reservation.auditRemark}</Text>
        </View>
      )}

      {renderActions()}
    </View>
  );
};

export default ReservationCard;
