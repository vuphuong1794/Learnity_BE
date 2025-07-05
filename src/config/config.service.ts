// src/config/config.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private config: NestConfigService) {}

  get firebase() {
    return {
      type: this.config.get<string>('FIREBASE_TYPE'),
      projectId: this.config.get<string>('FIREBASE_PROJECT_ID'),
      privateKeyId: this.config.get<string>('FIREBASE_PRIVATE_KEY_ID'),
      privateKey: this.config.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
      clientEmail: this.config.get<string>('FIREBASE_CLIENT_EMAIL'),
      clientId: this.config.get<string>('FIREBASE_CLIENT_ID'),
      authUri: this.config.get<string>('FIREBASE_AUTH_URI'),
      tokenUri: this.config.get<string>('FIREBASE_TOKEN_URI'),
      authProviderCertUrl: this.config.get<string>('FIREBASE_AUTH_PROVIDER_CERT_URL'),
      clientCertUrl: this.config.get<string>('FIREBASE_CLIENT_CERT_URL'),
      universeDomain: this.config.get<string>('UNIVERSE_DOMAIN'),
    };
  }

  get port(): number {
    return this.config.get<number>('PORT') ?? 3000;
  }
}
