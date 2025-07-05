import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('send-otp')
  sendOtp(@Body('email') email: string) {
    return this.authService.sendOtp(email);
  }

  @Post('verify-otp')
  verifyOtp(@Body() data: { email: string; otp: string }) {
    return this.authService.verifyOtp(data.email, data.otp);
  }

  @Post('reset-password')
  resetPassword(@Body() data: { email: string; newPassword: string }) {
    return this.authService.resetPassword(data.email, data.newPassword);
  }

  @Delete('user/:uid')
    deleteUser(@Param('uid') uid: string) {
      return this.authService.deleteUser(uid);
    }
}
