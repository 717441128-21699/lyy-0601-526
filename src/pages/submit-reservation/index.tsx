import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Input, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { devices } from '@/data/devices';
import { timeSlots, teamMembers } from '@/data/devices';
import { reservations } from '@/data/reservations';
import { useUserStore } from '@/store/useUserStore';
import { generateId, detectTimeConflict, formatDate } from '@/utils';
import styles from './index.module.scss';

const SubmitReservationPage: React.FC = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const deviceId = router.params.deviceId as string;
  const date = router.params.date as string;
  const slotsParam = router.params.slots as string;
  
  const [purpose, setPurpose] = useState('');
  const [remark, setRemark] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [device, setDevice] = useState<any>(null);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  useEffect(() => {
    const found = devices.find(d => d.id === deviceId);
    if (found) setDevice(found);
    if (slotsParam) setSelectedSlots(slotsParam.split(','));
  }, [deviceId, slotsParam]);

  const getSlotText = (slotId: string) => {
    const slot = timeSlots.find(s => s.id === slotId);
    return slot ? `${slot.startTime}-${slot.endTime}` : slotId;
  };

  const handleAddMember = () => {
    Taro.showActionSheet({
      itemList: teamMembers.filter(m => !selectedMembers.includes(m.id)).map(m => m.name),
      success: (res) => {
        const available = teamMembers.filter(m => !selectedMembers.includes(m.id));
        if (available[res.tapIndex]) {
          setSelectedMembers([...selectedMembers, available[res.tapIndex].id]);
        }
      }
    });
  };

  const handleRemoveMember = (memberId: string) => {
    setSelectedMembers(selectedMembers.filter(id => id !== memberId));
  };

  const handleSubmit = () => {
    if (!purpose.trim()) {
      Taro.showToast({ title: '请填写使用用途', icon: 'none' });
      return;
    }

    const startTime = getSlotText(selectedSlots[0]).split('-')[0];
    const endTime = getSlotText(selectedSlots[selectedSlots.length - 1]).split('-')[1];

    const conflict = detectTimeConflict(date, startTime, endTime, reservations, user.id);
    if (conflict) {
      Taro.showModal({
        title: '预约冲突',
        content: `您在 ${date} ${startTime}-${endTime} 已有其他预约，是否继续？`,
        success: (res) => {
          if (res.confirm) doSubmit();
        }
      });
      return;
    }

    doSubmit();
  };

  const doSubmit = () => {
    const startTime = getSlotText(selectedSlots[0]).split('-')[0];
    const endTime = getSlotText(selectedSlots[selectedSlots.length - 1]).split('-')[1];
    
    const newReservation = {
      id: generateId(),
      userId: user.id,
      userName: user.name,
      deviceId: device.id,
      deviceName: device.name,
      labId: device.labId,
      labName: '物理实验室',
      date: date || formatDate(new Date()),
      startTime,
      endTime,
      purpose,
      remark,
      teamMembers: selectedMembers.map(id => {
        const m = teamMembers.find(tm => tm.id === id);
        return m || { id, name: '未知', studentId: '' };
      }),
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    reservations.unshift(newReservation);
    console.log('[Submit] 提交预约:', newReservation);
    Taro.showToast({ title: '提交成功', icon: 'success' });
    setTimeout(() => Taro.switchTab({ url: '/pages/reservation/index' }), 1000);
  };

  if (!device) return <ScrollView className={styles.page}><View className={styles.section}><Text>加载中...</Text></View></ScrollView>;

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>📱 预约设备</Text>
        <View className={styles.selectedInfo}>
          <Text style={{ fontWeight: 600, color: '#0F172A' }}>{device.name}</Text>
          <Text>{'\n'}📅 {date || formatDate(new Date())}</Text>
          <Text>{'\n'}⏰ {selectedSlots.map(s => getSlotText(s)).join('、')}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>📝 预约信息</Text>
        <View className={styles.formItem}>
          <Text className={styles.label}>使用用途 *</Text>
          <Input
            className={styles.input}
            placeholder="请输入使用用途，如：课程实验、项目研究等"
            value={purpose}
            onInput={(e) => setPurpose(e.detail.value)}
          />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.label}>备注说明</Text>
          <Textarea
            className={styles.textarea}
            placeholder="请输入备注说明（可选）"
            value={remark}
            onInput={(e) => setRemark(e.detail.value)}
            maxlength={200}
          />
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>👥 同组成员</Text>
        <View className={styles.memberList}>
          {selectedMembers.map(memberId => {
            const member = teamMembers.find(m => m.id === memberId);
            return member ? (
              <View key={memberId} className={styles.memberTag}>
                <Text className={styles.memberName}>{member.name}</Text>
                <Text className={styles.removeMember} onClick={() => handleRemoveMember(memberId)}>×</Text>
              </View>
            ) : null;
          })}
          <View className={styles.addMember} onClick={handleAddMember}>
            <Text>+ 添加成员</Text>
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.btnSecondary} onClick={() => Taro.navigateBack()}>
          <Text className={styles.btnText}>取消</Text>
        </View>
        <View className={styles.btnPrimary} onClick={handleSubmit}>
          <Text className={styles.btnText}>提交预约</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SubmitReservationPage;
