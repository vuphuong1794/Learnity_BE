import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { FirebaseAdminModule } from '../common/firebase-admin.module';

@Module({
  imports: [FirebaseAdminModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule { }
