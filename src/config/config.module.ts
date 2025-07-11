// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService } from './config.service';

@Module({
  imports: [NestConfigModule.forRoot({ isGlobal: true })],
  providers: [ConfigService],
  exports: [ConfigService], // ✅ xuất ra để module khác dùng
})
export class ConfigModule {}
