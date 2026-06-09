import { User, TeamMember } from '@/types';

export const currentUser: User = {
  id: 'u001',
  name: '张同学',
  studentId: '2024001001',
  avatar: 'https://picsum.photos/id/64/200/200',
  role: 'student',
  department: '计算机科学与技术学院',
  phone: '13800138001',
  creditScore: 95,
  violationCount: 1,
};

export const labAssistant: User = {
  id: 'a001',
  name: '李实验员',
  avatar: 'https://picsum.photos/id/91/200/200',
  role: 'labAssistant',
  department: '实验中心',
  phone: '13900139001',
  creditScore: 100,
  violationCount: 0,
};

export const teamMembers: TeamMember[] = [
  { id: 'tm001', name: '王同学', studentId: '2024001002' },
  { id: 'tm002', name: '刘同学', studentId: '2024001003' },
  { id: 'tm003', name: '陈同学', studentId: '2024001004' },
  { id: 'tm004', name: '赵同学', studentId: '2024001005' },
  { id: 'tm005', name: '孙同学', studentId: '2024001006' },
];
