import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OtpDocument } from '../../src/schemas/otp.schema';
import { randomInt } from 'crypto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('Otp') private otpModel: Model<OtpDocument>,
    ) { }

    async sendOtp(email: string) {
        const otp = randomInt(100000, 999999).toString();

        await this.otpModel.findOneAndUpdate(
            { email },
            { email, otp, createdAt: new Date() },
            { upsert: true }
        );

        // Gửi email OTP
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'pvunguyen84@gmail.com',
                pass: 'qfkb lley xjsx mjuv',
            },
        });

        await transporter.sendMail({
            from: '"Learnity" <noreply@learnity.com>',
            to: email,
            subject: 'Mã xác nhận đổi mật khẩu',
            text: `Mã OTP của bạn là: ${otp}`,
        });

        return { message: 'OTP đã gửi thành công' };
    }

    async verifyOtp(email: string, otp: string) {
        const record = await this.otpModel.findOne({ email });
        if (!record || record.otp !== otp) {
            throw new Error('OTP không đúng');
        }

        const createdAt = record.get('createdAt') as Date;
        const diff = (new Date().getTime() - createdAt.getTime()) / 60000;

        if (diff > 10) {
            throw new Error('OTP đã hết hạn');
        }

        return { message: 'OTP hợp lệ' };
    }

    async resetPassword(email: string, newPassword: string) {
        const user = await admin.auth().getUserByEmail(email);
        if (!user) throw new Error('Không tìm thấy tài khoản');

        await admin.auth().updateUser(user.uid, { password: newPassword });

        await this.otpModel.deleteOne({ email }); // Xoá OTP sau khi reset

        return { message: 'Mật khẩu đã được cập nhật' };
    }
}
