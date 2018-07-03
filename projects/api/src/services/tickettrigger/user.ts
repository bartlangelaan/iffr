import fetch from 'node-fetch';
import { getTicketTriggerPassword } from '../../utils/environment';
import TicketTriggerUserSummary from './__API_RESPONSES__/user-summary';
import { assure } from '../../utils/validate-schema';
import { Injectable } from '@nestjs/common';

const basicAuthString = Buffer.from(
  `iffr:${getTicketTriggerPassword()}`,
).toString('base64');

@Injectable()
export class TicketTriggerUserService {
  private async fetch(path: string) {
    const f = await fetch(`https://tt.iffr.com${path}`, {
      headers: {
        Authorization: `Basic ${basicAuthString}`,
      },
      timeout: 5000,
    });

    return f.json();
  }

  async getSummary(user: string): Promise<TicketTriggerUserSummary> {
    const summary = await this.fetch(`/en/bridge/user/${user}/summary.json`);

    if (summary.client === null) throw new Error('User not found.');

    assure('TTUserSummary', summary);

    return summary;
  }

  async query(query: string) {
    const results = await this.fetch(
      `/en/bridge/find/customer/email/like/${query}`,
    );

    return results;
  }
}
