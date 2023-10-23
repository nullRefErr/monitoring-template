import { Injectable } from '@nestjs/common';

@Injectable()
export class AppHelper {
  constructor() {}
  public async sleep(timeout: number) {
    return new Promise((res) => setTimeout(res, timeout));
  }
}
