import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { SendNotificationDto } from './dto/send-notification.dto';
import { channel } from 'diagnostics_channel';

@Injectable()
export class NotificationService {
    async sendPush(notification: SendNotificationDto) {
        try {
            await firebase
                .messaging()
                .send({
                    notification: {
                        title: notification.title,
                        body: notification.body,
                    },
                    token: notification.deviceId,
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
        } catch (error) {
            console.error('Error sending push notification:', error);
            throw new Error('Failed to send push notification');
        }
    }
}

