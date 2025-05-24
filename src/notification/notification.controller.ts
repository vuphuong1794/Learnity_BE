import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SendNotificationDto } from './dto/send-notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Post()
  sendNotification(@Body() pushNotification: SendNotificationDto) {
    this.notificationService.sendPush(pushNotification);
  }
}
