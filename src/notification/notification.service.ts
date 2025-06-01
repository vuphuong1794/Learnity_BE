import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { SendNotificationDto } from './dto/send-notification.dto';

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
            console.log('Sending to deviceId:', deviceId);

            const message = {
                notification: {
                    title: notification.title,
                    body: notification.body,
                },
                token: deviceId,
                data: {
                    // Add any custom data here if needed
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
                }
            };

            const response = await firebase.messaging().send(message);
            console.log('Successfully sent message:', response);

            return { success: true, messageId: response };
        } catch (error) {
            console.error('Error sending push notification:', error);

            // Handle specific Firebase errors
            if (error.code === 'messaging/registration-token-not-registered') {
                console.error('Token is not registered. The token may be expired or the app may have been uninstalled.');
                return {
                    success: false,
                    error: 'TOKEN_NOT_REGISTERED',
                    message: 'FCM token is invalid or expired'
                };
            } else if (error.code === 'messaging/invalid-registration-token') {
                console.error('Invalid registration token format.');
                return {
                    success: false,
                    error: 'INVALID_TOKEN_FORMAT',
                    message: 'FCM token format is invalid'
                };
            } else if (error.errorInfo?.message === 'Requested entity was not found.') {
                console.error('FCM token not found. Token may be expired or app uninstalled.');
                return {
                    success: false,
                    error: 'TOKEN_NOT_FOUND',
                    message: 'FCM token not found - may be expired'
                };
            }

            // For other errors, still throw
            throw new Error(`Failed to send push notification: ${error.message}`);
        }
    }

    // New method to validate multiple tokens
    async validateTokens(tokens: string[]): Promise<{ validTokens: string[], invalidTokens: string[] }> {
        const validTokens: string[] = [];
        const invalidTokens: string[] = [];

        for (const token of tokens) {
            try {
                // Try to send a test message (dry run)
                await firebase.messaging().send({
                    token: token,
                    notification: {
                        title: 'Test',
                        body: 'Test'
                    }
                }, true); // dry run = true

                validTokens.push(token);
            } catch (error) {
                console.log(`Invalid token: ${token}`, error.code);
                invalidTokens.push(token);
            }
        }

        return { validTokens, invalidTokens };
    }
}