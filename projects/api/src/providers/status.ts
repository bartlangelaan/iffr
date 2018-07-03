import { Injectable } from '@nestjs/common';

const upSince = new Date().getTime();

@Injectable()
export class StatusProvider {
  status() {
    return {
      upSince,
      status: 'OK',
      time: new Date().getTime(),
    };
  }
}
