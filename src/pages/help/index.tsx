import React, { useState } from 'react';
import { View, Text, ScrollView, Textarea, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from '../common.module.scss';

const HelpPage: React.FC = () => {
  const [feedbackType, setFeedbackType] = useState('');
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faqs = [
    { id: '1', q: '如何预约设备？', a: '首页→选择设备→选择时段→填写用途→提交预约。预约成功后会收到消息通知。' },
    { id: '2', q: '预约冲突了怎么办？', a: '系统会自动检测时间冲突，如需继续可选择是否强制提交。建议调整时段或设备。' },
    { id: '3', q: '如何签到？', a: '预约时段前30分钟可在签到页面点击签到，生成二维码后在实验室扫码，或手动点击完成签到。' },
    { id: '4', q: '未签到有什么影响？', a: '预约未签到会扣除5分信用分，并记录一次违约。信用分过低会影响预约权限。' },
    { id: '5', q: '如何申请申诉？', a: '个人中心→违规申诉→选择记录→填写理由→提交。管理员会在3个工作日内处理。' },
    { id: '6', q: '信用分怎么计算？', a: '按时完成+2分，未签到-5分，超时使用每10分钟-2分，违规操作-5~10分。' },
  ];

  const handleSubmit = () => {
    if (!feedbackType || !content.trim()) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    console.log('[Help] 提交反馈:', { feedbackType, content, contact });
    Taro.showToast({ title: '反馈已提交', icon: 'success' });
    setContent('');
    setContact('');
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.listContainer}>
        <View className={styles.card}>
          <Text className={styles.cardTitle}>❓ 常见问题</Text>
        </View>
        {faqs.map(faq => (
          <View key={faq.id} className={styles.card} style={{ marginBottom: 12 }}>
            <View
              className={styles.cardHeader}
              onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
            >
              <Text className={styles.cardTitle} style={{ fontSize: 26 }}>{faq.q}</Text>
              <Text style={{ fontSize: 24, color: '#2563EB' }}>{expandedId === faq.id ? '▲' : '▼'}</Text>
            </View>
            {expandedId === faq.id && (
              <Text className={styles.cardTime} style={{ marginTop: 12, lineHeight: 1.7 }}>{faq.a}</Text>
            )}
          </View>
        ))}

        <View className={styles.formSection} style={{ marginTop: 32 }}>
          <Text className={styles.formTitle}>📝 意见反馈</Text>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>反馈类型</Text>
            <View style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {['功能建议', 'Bug反馈', '使用问题', '其他'].map(type => (
                <View
                  key={type}
                  style={{
                    padding: '12rpx 24rpx',
                    background: feedbackType === type ? '#2563EB' : '#F1F5F9',
                    borderRadius: 8,
                  }}
                  onClick={() => setFeedbackType(type)}
                >
                  <Text style={{ color: feedbackType === type ? '#fff' : '#64748B', fontSize: 24 }}>{type}</Text>
                </View>
              ))}
            </View>
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>反馈内容 *</Text>
            <Textarea
              className={styles.formTextarea}
              placeholder="请详细描述您的问题或建议..."
              value={content}
              onInput={(e) => setContent(e.detail.value)}
            />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>联系方式</Text>
            <Input
              className={styles.formInput}
              placeholder="手机号或邮箱（可选，方便联系您）"
              value={contact}
              onInput={(e) => setContact(e.detail.value)}
            />
          </View>
          <View className={styles.btnPrimary} onClick={handleSubmit}>
            <Text className={styles.btnText}>提交反馈</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HelpPage;
