export interface User {
  id: string;
  name: string;
  studentId?: string;
  avatar: string;
  role: 'student' | 'labAssistant' | 'admin';
  department: string;
  phone: string;
  creditScore: number;
  violationCount: number;
}

export interface Lab {
  id: string;
  name: string;
  building: string;
  room: string;
  description: string;
  capacity: number;
  openTime: string;
  closeTime: string;
  status: 'open' | 'closed' | 'maintenance';
  safetyRequirement: string;
}

export interface Device {
  id: string;
  name: string;
  labId: string;
  labName: string;
  type: string;
  model: string;
  code: string;
  location: string;
  description: string;
  image: string;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved' | 'unavailable';
  openTime: string;
  maxUsageHours: number;
  advanceBookingHours: number;
  usageRules: string;
  safetyRequirements: string[];
  isFavorite?: boolean;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  capacity: number;
  reserved: number;
}

export interface Reservation {
  id: string;
  deviceId: string;
  deviceName: string;
  labId: string;
  labName: string;
  userId: string;
  userName: string;
  date: string;
  timeSlot: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed' | 'noShow';
  purpose: string;
  remark?: string;
  teamMembers: TeamMember[];
  checkInTime?: string;
  checkOutTime?: string;
  usageResult?: string;
  abnormalFeedback?: string;
  checkoutRemark?: string;
  createdAt: string;
  auditor?: string;
  auditRemark?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  studentId: string;
}

export interface Message {
  id: string;
  type: 'system' | 'reservation' | 'audit' | 'notice';
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
}

export interface Schedule {
  id: string;
  date: string;
  labId: string;
  labName: string;
  assistantId: string;
  assistantName: string;
  startTime: string;
  endTime: string;
  reservations: Reservation[];
}

export interface ViolationRecord {
  id: string;
  userId: string;
  type: string;
  description: string;
  date: string;
  scoreDeducted: number;
  status: 'pending' | 'appealed' | 'resolved';
  appealContent?: string;
  appealResult?: string;
}

export interface LabNotification {
  id: string;
  labId: string;
  labName: string;
  title: string;
  content: string;
  type: 'temporary' | 'maintenance' | 'safety';
  startTime: string;
  endTime: string;
  createdAt: string;
}

export type FilterOptions = {
  labId?: string;
  deviceType?: string;
  date?: string;
  timeSlot?: string;
};

export type DeviceType = {
  value: string;
  label: string;
};
