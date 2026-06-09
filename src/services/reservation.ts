import { Reservation, TeamMember, ViolationRecord } from '@/types';
import { reservations, violationRecords } from '@/data/reservations';
import { validateTimeConflict, generateId } from '@/utils';

export const getReservations = (userId?: string, status?: string): Promise<Reservation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...reservations];
      
      if (userId) {
        result = result.filter(r => r.userId === userId);
      }
      if (status) {
        result = result.filter(r => r.status === status);
      }
      
      resolve(result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }, 300);
  });
};

export const getReservationById = (id: string): Promise<Reservation | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(reservations.find(r => r.id === id));
    }, 200);
  });
};

export const getPendingReservations = (): Promise<Reservation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(reservations.filter(r => r.status === 'pending'));
    }, 300);
  });
};

export const createReservation = (data: {
  deviceId: string;
  deviceName: string;
  labName: string;
  userId: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  timeSlot: string;
  purpose: string;
  teamMembers: TeamMember[];
}): Promise<Reservation> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existingReservations = reservations.filter(
        r => r.deviceId === data.deviceId && r.date === data.date && r.status !== 'cancelled' && r.status !== 'rejected'
      );

      if (validateTimeConflict(existingReservations, data.startTime, data.endTime)) {
        console.error('[ReservationService] 预约时间冲突');
        reject(new Error('该时段已被预约，请选择其他时段'));
        return;
      }

      const newReservation: Reservation = {
        id: generateId(),
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        teamMembers: data.teamMembers || [],
      };

      reservations.unshift(newReservation);
      console.log(`[ReservationService] 创建预约成功: ${newReservation.id}`);
      resolve(newReservation);
    }, 300);
  });
};

export const cancelReservation = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reservation = reservations.find(r => r.id === id);
      if (reservation) {
        reservation.status = 'cancelled';
        console.log(`[ReservationService] 取消预约成功: ${id}`);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 200);
  });
};

export const auditReservation = (
  id: string,
  status: 'approved' | 'rejected',
  auditor: string,
  remark?: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reservation = reservations.find(r => r.id === id);
      if (reservation) {
        reservation.status = status;
        reservation.auditor = auditor;
        reservation.auditRemark = remark;
        console.log(`[ReservationService] 审核预约成功: ${id} -> ${status}`);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 200);
  });
};

export const adjustReservationTime = (
  id: string,
  newDate: string,
  newStartTime: string,
  newEndTime: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reservation = reservations.find(r => r.id === id);
      if (reservation) {
        reservation.date = newDate;
        reservation.startTime = newStartTime;
        reservation.endTime = newEndTime;
        console.log(`[ReservationService] 调整预约时间成功: ${id}`);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 200);
  });
};

export const checkIn = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reservation = reservations.find(r => r.id === id);
      if (reservation) {
        reservation.checkInTime = new Date().toTimeString().substring(0, 5);
        console.log(`[ReservationService] 签到成功: ${id}`);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 200);
  });
};

export const checkOut = (
  id: string,
  usageResult: string,
  abnormalFeedback: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reservation = reservations.find(r => r.id === id);
      if (reservation) {
        reservation.checkOutTime = new Date().toTimeString().substring(0, 5);
        reservation.usageResult = usageResult;
        reservation.abnormalFeedback = abnormalFeedback;
        reservation.status = 'completed';
        console.log(`[ReservationService] 签退成功: ${id}`);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 200);
  });
};

export const getViolationRecords = (userId: string): Promise<ViolationRecord[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(violationRecords.filter(v => v.userId === userId));
    }, 300);
  });
};

export const submitAppeal = (
  violationId: string,
  appealContent: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const record = violationRecords.find(v => v.id === violationId);
      if (record) {
        record.status = 'appealed';
        record.appealContent = appealContent;
        console.log(`[ReservationService] 提交申诉成功: ${violationId}`);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 300);
  });
};
