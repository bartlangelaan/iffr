import user from '../services/tickettrigger/user';

class UserProvider {
  async getUser(userUuid: string) {
    const {
      client: { Name, Birthday },
    } = await user.getSummary(userUuid);

    const bd = Birthday ? new Date(Birthday) : null;

    return {
      name: {
        first: Name.First,
        full: [Name.First, Name.Middle, Name.Last].filter(s => s).join(' '),
      },
      birthday: bd
        ? [
            bd.getFullYear(),
            (bd.getMonth() + 1).toString().padStart(2, '0'),
            (bd.getDay() + 1).toString().padStart(2, '0'),
          ].join('-')
        : null,
    };
  }
}

export default new UserProvider();
