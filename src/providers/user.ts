import user from '../services/tickettrigger/user';

class UserProvider {
  async getUser(userUuid: string) {
    const ttSummary = await user.getSummary(userUuid);

    return {
      name: {
        first: ttSummary.client.Name.First,
        last: ttSummary.client.Name.Last,
      },
    };
  }
}

export default new UserProvider();
