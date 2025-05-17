import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OtpDocument = Otp & Document;

@Schema({ timestamps: true })
export class Otp {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  otp: string;

  @Prop({
    required: true,
    default: Date.now,
    expires: 900, // 15 phút (900 giây)
  })
  createdAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
