import { create } from 'zustand';
import { User } from '@/types';
import { currentUser } from '@/data/users';

interface UserState {
  user: User;
  role: 'student' | 'labAssistant' | 'admin';
  setRole: (role: 'student' | 'labAssistant' | 'admin') => void;
  toggleRole: () => void;
  updateCreditScore: (score: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: currentUser,
  role: 'student',
  setRole: (role) => set({ role }),
  toggleRole: () => set((state) => ({
    role: state.role === 'student' ? 'labAssistant' : 'student'
  })),
  updateCreditScore: (score) => set((state) => ({
    user: { ...state.user, creditScore: score }
  })),
}));
