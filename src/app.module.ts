import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from './schemas/otp.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationModule } from './notification/notification.module';
import { FirebaseAdminProvider } from './common/firebase-admin';
import { FirebaseAdminModule } from './common/firebase-admin.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');

        return { uri };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    NotificationModule,
    FirebaseAdminModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
