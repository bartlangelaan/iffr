import status from '../providers/status';
import { Controller, Get } from '@nestjs/common';

@Controller('status')
export class StatusController {
  @Get()
  status() {
    return status();
  }
}
