
import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RequestPermissionsDto {
  @ApiModelProperty({ required: true })
  @IsNotEmpty()
  readonly deviceId: string;
  @ApiModelProperty({ required: true })
  @IsNotEmpty()
  readonly dappId: string;
  @ApiModelProperty({ required: true, isArray: true, type: 'integer' })
  @IsNotEmpty()
  readonly assets: number[];
}
