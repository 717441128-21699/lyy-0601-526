import React, { useState } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { teamMembers } from '@/data/devices';
import { TeamMember } from '@/types';
import styles from '../common.module.scss';

const TeamManagementPage: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>(teamMembers);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newStudentId, setNewStudentId] = useState('');

  const handleAdd = () => {
    if (!newName.trim() || !newStudentId.trim()) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    const newMember: TeamMember = {
      id: `m${Date.now()}`,
      name: newName.trim(),
      studentId: newStudentId.trim(),
    };
    setMembers([...members, newMember]);
    setNewName('');
    setNewStudentId('');
    setShowAdd(false);
    Taro.showToast({ title: '添加成功', icon: 'success' });
  };

  const handleRemove = (id: string) => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除该组员吗？',
      success: (res) => {
        if (res.confirm) {
          setMembers(members.filter(m => m.id !== id));
        }
      }
    });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.listContainer}>
        <View className={styles.card}>
          <View className={styles.cardHeader}>
            <Text className={styles.cardTitle}>👥 常用组员 ({members.length})</Text>
            <Text style={{ color: '#2563EB', fontSize: 24 }} onClick={() => setShowAdd(true)}>+ 添加</Text>
          </View>
        </View>

        {showAdd && (
          <View className={styles.formSection}>
            <Text className={styles.formTitle}>添加组员</Text>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>姓名</Text>
              <Input
                className={styles.formInput}
                placeholder="请输入姓名"
                value={newName}
                onInput={(e) => setNewName(e.detail.value)}
              />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>学号</Text>
              <Input
                className={styles.formInput}
                placeholder="请输入学号"
                value={newStudentId}
                onInput={(e) => setNewStudentId(e.detail.value)}
              />
            </View>
            <View style={{ display: 'flex', gap: 16 }}>
              <View className={styles.btnSecondary} style={{ flex: 1, height: 72 }} onClick={() => setShowAdd(false)}>
                <Text className={styles.btnText}>取消</Text>
              </View>
              <View className={styles.btnPrimary} style={{ flex: 1, height: 72 }} onClick={handleAdd}>
                <Text className={styles.btnText}>确认添加</Text>
              </View>
            </View>
          </View>
        )}

        {members.map(member => (
          <View key={member.id} className={styles.listItem}>
            <View className={styles.itemLeft}>
              <View className={`${styles.itemIcon} ${styles.iconBlue}`}>
                <Text>{member.name.charAt(0)}</Text>
              </View>
              <View className={styles.itemContent}>
                <Text className={styles.itemTitle}>{member.name}</Text>
                <Text className={styles.itemDesc}>学号: {member.studentId}</Text>
              </View>
            </View>
            <Text style={{ color: '#EF4444', fontSize: 24 }} onClick={() => handleRemove(member.id)}>删除</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default TeamManagementPage;
