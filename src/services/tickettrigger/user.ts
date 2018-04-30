import fetch from 'node-fetch';
import { getTicketTriggerPassword } from '../../utils/environment';
import TicketTriggerUserSummary from './__API_RESPONSES__/user-summary';
import { assure } from '../../utils/validate-schema';

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

  async getSummary(user: string): Promise<TicketTriggerUserSummary> {
    const summary = await this.fetch(`/en/bridge/user/${user}/summary.json`);

    assure('TTUserSummary', summary);

    return summary;
  }
}

export default new TicketTriggerUserService();
