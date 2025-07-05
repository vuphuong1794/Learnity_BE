import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { SendNotificationDto } from './dto/send-notification.dto';

@Injectable()
export class NotificationService {
  async sendPush(notification: SendNotificationDto) {
    const deviceIds = Array.isArray(notification.deviceId)
      ? notification.deviceId.filter(Boolean)
      : [notification.deviceId];

    if (!deviceIds || deviceIds.length === 0) {
      console.error('Không có deviceId nào để gửi');
      throw new Error('deviceId is required');
    }

    const messagePayload = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: {
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },
      android: {
        priority: 'high' as const,
        notification: {
          sound: 'default',
          channelId: 'default',
          clickAction: 'FLUTTER_NOTIFICATION_CLICK',
        },
      },
      apns: {
        headers: {
          'apns-priority': '10',
        },
        payload: {
          aps: {
            contentAvailable: true,
            sound: 'default',
            category: 'FLUTTER_NOTIFICATION_CLICK',
          },
        },
      },
    };

    try {
      if (deviceIds.length === 1) {
        const response = await firebase.messaging().send({
          ...messagePayload,
          token: deviceIds[0],
        });

        console.log('Sent to single token:', response);
        return { success: true, messageId: response };
      } else {
        const response = await firebase.messaging().sendEachForMulticast({
          ...messagePayload,
          tokens: deviceIds,
        });

        console.log(
          `Sent multicast. Success: ${response.successCount}, Failure: ${response.failureCount}`,
        );

        const failedTokens: string[] = [];

        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            console.warn(
              `Failed to send to ${deviceIds[idx]}:`,
              resp.error?.code,
            );
            failedTokens.push(deviceIds[idx]);
          }
        });

        return {
          success: response.failureCount === 0,
          successCount: response.successCount,
          failureCount: response.failureCount,
          failedTokens,
        };
      }
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw new Error(`Failed to send push notification: ${error.message}`);
    }
  }

  // New method to validate multiple tokens
  async validateTokens(
    tokens: string[],
  ): Promise<{ validTokens: string[]; invalidTokens: string[] }> {
    const validTokens: string[] = [];
    const invalidTokens: string[] = [];

    for (const token of tokens) {
      try {
        // Try to send a test message (dry run)
        await firebase.messaging().send(
          {
            token: token,
            notification: {
              title: 'Test',
              body: 'Test',
            },
          },
          true,
        ); // dry run = true

        validTokens.push(token);
      } catch (error) {
        console.log(`Invalid token: ${token}`, error.code);
        invalidTokens.push(token);
      }
    }

    return { validTokens, invalidTokens };
  }
}
