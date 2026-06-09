import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useUserStore } from '@/store/useUserStore';
import { reservations } from '@/data/reservations';
import { devices } from '@/data/devices';
import { formatDateTime, getRoleText } from '@/utils';
import styles from './index.module.scss';

const ProfilePage: React.FC = () => {
  const { user, role, toggleRole } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalReservations: 0,
    completedCount: 0,
    noShowCount: 0,
    favoriteCount: 0,
  });

  useEffect(() => {
    loadStats();
  }, [user.id]);

  const loadStats = () => {
    console.log('[ProfilePage] 加载统计数据');
    const userReservations = reservations.filter(r => r.userId === user.id);
    const completedCount = userReservations.filter(r => r.status === 'completed').length;
    const noShowCount = userReservations.filter(r => r.status === 'noShow').length;
    const favoriteCount = devices.filter(d => d.isFavorite).length;

    setStats({
      totalReservations: userReservations.length,
      completedCount,
      noShowCount,
      favoriteCount,
    });
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      loadStats();
      setLoading(false);
      Taro.stopPullDownRefresh();
    }, 500);
  };

  const handleMenuClick = (key: string) => {
    console.log('[ProfilePage] 点击菜单:', key);
    const routeMap: Record<string, string> = {
      records: '/pages/records/index',
      favorites: '/pages/favorites/index',
      credit: '/pages/credit-detail/index',
      violations: '/pages/appeal/index',
      team: '/pages/team-management/index',
      schedule: '/pages/schedule/index',
      notifications: '/pages/notifications/index',
      settings: '/pages/settings/index',
      about: '/pages/about/index',
      help: '/pages/help/index',
    };

    if (routeMap[key]) {
      Taro.navigateTo({ url: routeMap[key] });
    } else if (key === 'roleSwitch') {
      handleRoleSwitch();
    }
  };

  const handleRoleSwitch = () => {
    const newRole = role === 'student' ? 'labAssistant' : 'student';
    Taro.showModal({
      title: '切换角色',
      content: `确定要切换为${getRoleText(newRole)}身份吗？`,
      success: (res) => {
        if (res.confirm) {
          console.log('[ProfilePage] 切换角色到:', newRole);
          toggleRole();
          Taro.showToast({
            title: `已切换为${getRoleText(newRole)}`,
            icon: 'success',
          });
        }
      }
    });
  };

  const getCreditLevel = (score: number) => {
    if (score >= 90) return { text: '优秀', color: '#10B981' };
    if (score >= 80) return { text: '良好', color: '#3B82F6' };
    if (score >= 60) return { text: '及格', color: '#F59E0B' };
    return { text: '待提升', color: '#EF4444' };
  };

  const creditLevel = getCreditLevel(user.creditScore);

  const studentMenus = [
    { key: 'records', icon: '📅', title: '预约记录', subtitle: `${stats.totalReservations}条记录`, iconClass: 'iconBlue' },
    { key: 'favorites', icon: '⭐', title: '我的收藏', subtitle: `${stats.favoriteCount}个设备`, iconClass: 'iconYellow' },
    { key: 'credit', icon: '💯', title: '信用分详情', subtitle: `等级: ${creditLevel.text}`, iconClass: 'iconGreen', badge: stats.noShowCount },
    { key: 'violations', icon: '⚠️', title: '违规申诉', subtitle: '提交异议申请', iconClass: 'iconRed' },
  ];

  const labAssistantMenus = [
    { key: 'schedule', icon: '📋', title: '我的排班', subtitle: '查看排班表', iconClass: 'iconBlue' },
    { key: 'notifications', icon: '📢', title: '发布通知', subtitle: '临时停用/公告', iconClass: 'iconRed' },
    { key: 'records', icon: '📊', title: '使用记录', subtitle: '查看所有记录', iconClass: 'iconGreen' },
  ];

  const commonMenus = [
    { key: 'settings', icon: '⚙️', title: '设置', iconClass: 'iconPurple' },
    { key: 'help', icon: '❓', title: '帮助与反馈', iconClass: 'iconOrange' },
    { key: 'about', icon: 'ℹ️', title: '关于我们', iconClass: 'iconBlue' },
  ];

  const currentMenus = role === 'labAssistant' ? labAssistantMenus : studentMenus;

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refresherEnabled
      refresherTriggered={loading}
      onRefresherRefresh={handleRefresh}
    >
      <View className={styles.header}>
        <View className={styles.userInfo}>
          <View className={styles.avatar}>
            <Text>{user.name.charAt(0)}</Text>
          </View>
          <View className={styles.userDetails}>
            <View className={styles.userNameRow}>
              <Text className={styles.userName}>{user.name}</Text>
              <View className={styles.roleTag}>
                <Text>{getRoleText(role)}</Text>
              </View>
            </View>
            <Text className={styles.userId}>学号/工号: {user.id}</Text>
            <Text className={styles.userMajor}>{user.department} · {user.major}</Text>
          </View>
        </View>
      </View>

      <View className={styles.creditSection}>
        <View className={styles.statRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.totalReservations}</Text>
            <Text className={styles.statLabel}>总预约</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.completedCount}</Text>
            <Text className={styles.statLabel}>已完成</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue} style={{ color: stats.noShowCount > 0 ? '#EF4444' : undefined }}>{stats.noShowCount}</Text>
            <Text className={styles.statLabel}>违约</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.favoriteCount}</Text>
            <Text className={styles.statLabel}>收藏</Text>
          </View>
        </View>

        <View className={styles.creditRow}>
          <View className={styles.creditLabel}>
            <Text>⭐</Text>
            <Text>信用分</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text className={styles.creditValue}>{user.creditScore}</Text>
            <Text className={styles.creditLevel} style={{ color: creditLevel.color }}>{creditLevel.text}</Text>
          </View>
        </View>
        <View className={styles.creditBar}>
          <View className={styles.creditFill} style={{ width: `${user.creditScore}%` }} />
        </View>
        <View className={styles.creditTips}>
          <Text>0</Text>
          <Text>良好信用可享受优先预约权益</Text>
          <Text>100</Text>
        </View>
      </View>

      <View className={styles.roleSwitch}>
        <Text className={styles.roleSwitchText}>
          当前身份: {getRoleText(role)} · 点击切换角色体验不同功能
        </Text>
        <View
          className={styles.roleSwitchBtn}
          onClick={() => handleMenuClick('roleSwitch')}
        >
          <Text>切换</Text>
        </View>
      </View>

      <View className={styles.menuCard}>
        <Text className={styles.menuTitle}>常用功能</Text>
        {currentMenus.map((menu) => (
          <View
            key={menu.key}
            className={styles.menuItem}
            onClick={() => handleMenuClick(menu.key)}
          >
            <View className={classnames(styles.menuIcon, menu.iconClass)}>
              <Text>{menu.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text className={styles.menuText}>{menu.title}</Text>
              {menu.subtitle && <Text className={styles.menuSubtitle}>{menu.subtitle}</Text>}
            </View>
            {menu.badge && menu.badge > 0 && (
              <View className={styles.menuBadge}>
                <Text className={styles.menuBadgeText}>{menu.badge}</Text>
              </View>
            )}
            <View className={styles.menuArrow} />
          </View>
        ))}
      </View>

      <View className={styles.menuCard}>
        <Text className={styles.menuTitle}>其他</Text>
        {commonMenus.map((menu) => (
          <View
            key={menu.key}
            className={styles.menuItem}
            onClick={() => handleMenuClick(menu.key)}
          >
            <View className={classnames(styles.menuIcon, menu.iconClass)}>
              <Text>{menu.icon}</Text>
            </View>
            <Text className={styles.menuText}>{menu.title}</Text>
            <View className={styles.menuArrow} />
          </View>
        ))}
      </View>

      <View className={styles.bottomGap} />
    </ScrollView>
  );
};

export default ProfilePage;
