
import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { RequestPermissionsDto } from './request-permissions.dto';

export class ResponsePermissionsDto extends RequestPermissionsDto {
  @ApiModelProperty({ required: true, isArray: true, type: 'boolean' })
  @IsNotEmpty()
  readonly permissions: boolean[];
}
