import { ApiProperty } from "@nestjs/swagger";

export class SendNotificationDto {
    @ApiProperty()
    title: string;
    @ApiProperty()
    body: string;
    @ApiProperty()
    deviceId: string | string[];
}