import { StatusProvider } from '../providers/status';
import { Controller, Get } from '@nestjs/common';

@Controller('status')
export class StatusController {
  constructor(private readonly statusProvider: StatusProvider) {}
  @Get()
  status() {
    return this.statusProvider.status();
  }
}
