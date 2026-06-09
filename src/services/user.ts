import { User, TeamMember } from '@/types';
import { currentUser, teamMembers } from '@/data/users';

export const getCurrentUser = (): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(currentUser), 200);
  });
};

export const getTeamMembers = (): Promise<TeamMember[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(teamMembers), 300);
  });
};

export const updateUserInfo = (data: Partial<User>): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updated = { ...currentUser, ...data };
      Object.assign(currentUser, updated);
      console.log(`[UserService] 更新用户信息成功`);
      resolve(updated);
    }, 300);
  });
};

export const getUserById = (id: string): Promise<User | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (id === currentUser.id) {
        resolve(currentUser);
      } else {
        resolve(undefined);
      }
    }, 200);
  });
};
