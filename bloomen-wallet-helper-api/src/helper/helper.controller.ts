import { Controller, Get, Post, Body  } from '@nestjs/common';
import { RequestPermissionsDto } from './dto/request-permissions.dto';
import { HelperService } from './helper.service';
import { ResponsePermissionsDto } from './dto/response-permissions.dto';

@Controller('helper')
export class HelperController {

    constructor(private readonly helperService: HelperService) {}

    @Get()
    async sayHello() {
      return 'hello';
    }

    @Post('permissions')
    async requestPermissions(@Body() request: RequestPermissionsDto): Promise<ResponsePermissionsDto> {
     return this.helperService.permissions(request);
    }
}
