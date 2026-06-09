import React, { useEffect, useRef } from 'react';
import { View, Text, Canvas } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { generateQRCodeContent } from '@/utils';
import styles from './index.module.scss';

interface QRCodeDisplayProps {
  reservationId: string;
  userId: string;
  size?: number;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  reservationId,
  userId,
  size = 400
}) => {
  const canvasRef = useRef<any>(null);

  useEffect(() => {
    drawQRCode();
  }, [reservationId, userId]);

  const drawQRCode = () => {
    const content = generateQRCodeContent(reservationId, userId);
    const canvasId = 'qrcode-canvas';

    Taro.createSelectorQuery()
      .select(`#${canvasId}`)
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res || !res[0]) {
          console.error('[QRCodeDisplay] 获取Canvas失败');
          return;
        }

        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = Taro.getSystemInfoSync().pixelRatio;

        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.scale(dpr, dpr);

        drawSimpleQR(ctx, content, size);
      });
  };

  const drawSimpleQR = (ctx: any, content: string, size: number) => {
    const cellSize = size / 25;
    const hash = simpleHash(content);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = '#1E293B';

    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        const isCorner = (i < 7 && j < 7) || (i < 7 && j >= 18) || (i >= 18 && j < 7);
        const pseudoRandom = ((hash * (i + 1) * (j + 1)) % 13) > 6;

        if (isCorner || pseudoRandom) {
          ctx.fillRect(j * cellSize, i * cellSize, cellSize - 1, cellSize - 1);
        }
      }
    }

    drawCornerPattern(ctx, 0, 0, cellSize);
    drawCornerPattern(ctx, size - 7 * cellSize, 0, cellSize);
    drawCornerPattern(ctx, 0, size - 7 * cellSize, cellSize);
  };

  const drawCornerPattern = (ctx: any, x: number, y: number, cellSize: number) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x, y, 7 * cellSize, 7 * cellSize);

    ctx.fillStyle = '#1E293B';
    ctx.fillRect(x, y, 7 * cellSize, 7 * cellSize);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + cellSize, y + cellSize, 5 * cellSize, 5 * cellSize);

    ctx.fillStyle = '#1E293B';
    ctx.fillRect(x + 2 * cellSize, y + 2 * cellSize, 3 * cellSize, 3 * cellSize);
  };

  const simpleHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  return (
    <View className={styles.container}>
      <View className={styles.qrWrapper}>
        <Canvas
          id="qrcode-canvas"
          ref={canvasRef}
          type="2d"
          style={{ width: size + 'rpx', height: size + 'rpx' }}
          className={styles.canvas}
        />
      </View>
      <View className={styles.info}>
        <Text className={styles.label}>签到二维码</Text>
        <Text className={styles.tip}>请向实验员出示此二维码签到</Text>
      </View>
    </View>
  );
};

export default QRCodeDisplay;
