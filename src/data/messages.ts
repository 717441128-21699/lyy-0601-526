import { Message } from '@/types';

export const messages: Message[] = [
  {
    id: 'm001',
    type: 'reservation',
    title: '预约审核通过',
    content: '您预约的"高性能工作站"（2026-06-10 10:00-11:40）已通过审核，请按时到达实验室签到使用。',
    isRead: false,
    createdAt: '2026-06-09 16:30',
    relatedId: 'r001',
  },
  {
    id: 'm002',
    type: 'system',
    title: '系统维护通知',
    content: '系统将于2026年6月12日凌晨2:00-4:00进行维护升级，期间可能无法正常使用，请提前做好相关安排。',
    isRead: false,
    createdAt: '2026-06-09 10:00',
  },
  {
    id: 'm003',
    type: 'notice',
    title: '实验室安全培训',
    content: '所有本学期使用实验室的同学，请于6月13日（周六）上午9:00参加安全培训，地点：实验楼A101。',
    isRead: true,
    createdAt: '2026-06-08 15:00',
  },
  {
    id: 'm004',
    type: 'audit',
    title: '预约被拒绝',
    content: '您预约的"iMac一体机"（2026-06-05 14:00-15:40）未通过审核，原因：该时段设备已被预约，请选择其他时段。',
    isRead: true,
    createdAt: '2026-06-04 09:30',
    relatedId: 'r006',
  },
  {
    id: 'm005',
    type: 'reservation',
    title: '签到提醒',
    content: '您今天10:00有"高性能工作站"的预约，请提前10分钟到达实验室A301签到。',
    isRead: false,
    createdAt: '2026-06-10 08:00',
    relatedId: 'r001',
  },
  {
    id: 'm006',
    type: 'system',
    title: '信用分变动提醒',
    content: '您有一条新的违规记录：2026-06-08预约FPGA开发板未按时签到，扣除信用分5分。如有异议可在3天内申诉。',
    isRead: true,
    createdAt: '2026-06-08 18:00',
  },
  {
    id: 'm007',
    type: 'notice',
    title: '临时停用通知',
    content: '计算机基础实验室A301将于6月15日下午14:00-18:00进行设备维护，届时暂停预约和使用。',
    isRead: true,
    createdAt: '2026-06-08 10:00',
  },
  {
    id: 'm008',
    type: 'reservation',
    title: '预约已取消',
    content: '您已成功取消"云计算服务器集群"（2026-06-11 08:00-09:40）的预约。',
    isRead: true,
    createdAt: '2026-06-07 14:00',
    relatedId: 'r005',
  },
];

export const unreadCount = messages.filter(m => !m.isRead).length;
