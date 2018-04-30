import fetch from 'node-fetch';
import { getTicketTriggerPassword } from '../../utils/environment';

const basicAuthString = Buffer.from(
  `iffr:${getTicketTriggerPassword()}`,
).toString('base64');

class TicketTriggerUserService {
  private async fetch(path: string) {
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
