import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { SendNotificationDto } from './dto/send-notification.dto';
import { channel } from 'diagnostics_channel';

@Injectable()
export class NotificationService {
    async sendPush(notification: SendNotificationDto) {
        const deviceId =
            typeof notification.deviceId === 'string'
                ? notification.deviceId
                : notification.deviceId[0];

        if (!deviceId) {
            console.error('deviceId không tồn tại hoặc rỗng!');
            throw new Error('deviceId is required');
        }

        try {
            console.log('Sending to deviceId:', deviceId); // Debug
            await firebase
                .messaging()
                .send({
                    notification: {
                        title: notification.title,
                        body: notification.body,
                    },
                    token: deviceId,
                    data: {},
                    android: {
                        priority: 'high',
                        notification: {
                            sound: 'default',
                            channelId: 'default',
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
                            },
                        },
                    }
                });

            return { success: true }
        } catch (error) {
            console.error('Error sending push notification:', error);
            throw new Error('Failed to send push notification');
        }
    }
}

