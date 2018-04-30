import fetch from 'node-fetch';
import { getTicketTriggerPassword } from '../../utils/environment';

class TicketTriggerUserService {
  private async fetch(path: string) {
    const basicAuthString = Buffer.from(
      `iffr:${getTicketTriggerPassword()}`,
    ).toString('base64');

    const f = await fetch(`https://tt.iffr.com${path}`, {
      headers: {
        Authorization: `Basic ${basicAuthString}`,
      },
      timeout: 1000,
    });

    return f.json();
  }

  async getSummary(user: string) {
    return await this.fetch(`/en/bridge/user/${user}/summary.json`);
  }
}

export default new TicketTriggerUserService();
