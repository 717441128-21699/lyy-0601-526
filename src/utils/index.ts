import dayjs from 'dayjs';

export const formatDate = (date: string, format: string = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string, format: string = 'YYYY-MM-DD HH:mm'): string => {
  return dayjs(date).format(format);
};

export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
    cancelled: '已取消',
    completed: '已完成',
    noShow: '未签到',
    available: '可用',
    occupied: '使用中',
    maintenance: '维护中',
    reserved: '已预约',
    open: '开放中',
    closed: '已关闭',
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: 'yellow',
    approved: 'green',
    rejected: 'red',
    cancelled: 'secondary',
    completed: 'blue',
    noShow: 'red',
    available: 'green',
    occupied: 'yellow',
    maintenance: 'red',
    reserved: 'blue',
    open: 'green',
    closed: 'secondary',
  };
  return colorMap[status] || 'secondary';
};

export const getMessageTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    system: '系统消息',
    reservation: '预约消息',
    audit: '审核消息',
    notice: '通知公告',
  };
  return typeMap[type] || type;
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatTimeSlot = (startTime: string, endTime: string): string => {
  return `${startTime} - ${endTime}`;
};

export const getCreditLevel = (score: number): string => {
  if (score >= 90) return '优秀';
  if (score >= 80) return '良好';
  if (score >= 70) return '一般';
  if (score >= 60) return '及格';
  return '不及格';
};

export const getCreditColor = (score: number): string => {
  if (score >= 90) return '#10B981';
  if (score >= 80) return '#2563EB';
  if (score >= 70) return '#F59E0B';
  if (score >= 60) return '#F97316';
  return '#EF4444';
};

export const generateQRCodeContent = (reservationId: string, userId: string): string => {
  return JSON.stringify({
    reservationId,
    userId,
    timestamp: Date.now(),
  });
};

export const validateTimeConflict = (
  existingReservations: Array<{ startTime: string; endTime: string }>,
  newStartTime: string,
  newEndTime: string
): boolean => {
  const newStart = dayjs(`2000-01-01 ${newStartTime}`);
  const newEnd = dayjs(`2000-01-01 ${newEndTime}`);

  return existingReservations.some(reservation => {
    const existingStart = dayjs(`2000-01-01 ${reservation.startTime}`);
    const existingEnd = dayjs(`2000-01-01 ${reservation.endTime}`);
    return newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart);
  });
};

export const getRoleText = (role: string): string => {
  const roleMap: Record<string, string> = {
    student: '学生',
    labAssistant: '实验员',
    admin: '管理员',
  };
  return roleMap[role] || role;
};

export const detectTimeConflict = (
  date: string,
  startTime: string,
  endTime: string,
  existingReservations: Array<{ date: string; startTime: string; endTime: string; userId: string }>,
  userId: string
): boolean => {
  const userReservations = existingReservations.filter(r => r.userId === userId && r.date === date);
  return validateTimeConflict(userReservations, startTime, endTime);
};
