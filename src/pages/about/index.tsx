import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from '../common.module.scss';

const AboutPage: React.FC = () => {
  return (
    <ScrollView className={styles.page} scrollY>
      <View style={{
        background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
        padding: 64,
        textAlign: 'center',
        color: '#fff',
      }}>
        <Text style={{ fontSize: 80, display: 'block', marginBottom: 16 }}>🔬</Text>
        <Text style={{ fontSize: 40, fontWeight: 'bold', display: 'block' }}>实验室预约系统</Text>
        <Text style={{ fontSize: 24, opacity: 0.85 }}>版本 v1.0.0</Text>
      </View>

      <View className={styles.listContainer}>
        <View className={styles.card}>
          <Text className={styles.cardTitle}>📖 产品简介</Text>
          <Text className={styles.cardTime}>
            校园实验室预约App是一款专为高校师生打造的智能仪器设备管理平台，
            旨在实现实验室资源的高效利用，减少线下排队和人工登记。
          </Text>
        </View>

        <View className={styles.card}>
          <Text className={styles.cardTitle}>✨ 核心功能</Text>
          <Text className={styles.cardTime}>• 设备预约与冲突检测{'\n'}</Text>
          <Text className={styles.cardTime}>• 二维码签到签退{'\n'}</Text>
          <Text className={styles.cardTime}>• 使用结果与异常反馈{'\n'}</Text>
          <Text className={styles.cardTime}>• 信用分与违规申诉{'\n'}</Text>
          <Text className={styles.cardTime}>• 实验员审核与排班{'\n'}</Text>
          <Text className={styles.cardTime}>• 消息通知与推送</Text>
        </View>

        <View className={styles.card}>
          <Text className={styles.cardTitle}>👥 开发团队</Text>
          <Text className={styles.cardTime}>信息技术中心 · 智慧校园团队</Text>
        </View>

        <View className={styles.card}>
          <Text className={styles.cardTitle}>📞 联系我们</Text>
          <Text className={styles.cardTime}>客服热线: 400-123-4567{'\n'}</Text>
          <Text className={styles.cardTime}>邮箱: lab@university.edu.cn{'\n'}</Text>
          <Text className={styles.cardTime}>工作时间: 周一至周五 8:00-18:00</Text>
        </View>

        <View className={styles.card}>
          <Text className={styles.cardTitle}>©️ 版权信息</Text>
          <Text className={styles.cardTime}>Copyright © 2024 某大学信息技术中心{'\n'}</Text>
          <Text className={styles.cardTime}>All Rights Reserved</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default AboutPage;
