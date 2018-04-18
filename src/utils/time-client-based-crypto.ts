import { CustomError } from 'ts-custom-error';
import { Client } from '../clients';

import EasyCrypto from './easy-crypto';

/**
 * This class can encrypt and decrypt text, while checking if the client matches
 * and if the token isn't expired yet.
 */
export default class TimeClientBasedCrypto {
  private expirationTime: number;
  private crypto: EasyCrypto;

  constructor(expirationTime: number, password: string) {
    this.expirationTime = expirationTime * 1000;
    this.crypto = new EasyCrypto(password);
  }
  encrypt(text: string, client: Client) {
    return this.crypto.encrypt(
      [client.salt, new Date().getTime().toString(), text].join(':'),
    );
  }
  decrypt(encodedText: string, client?: Client) {
    const decrypted = this.crypto.decrypt(encodedText);
    const [salt, time, text] = decrypted.split(':', 3);

    if (client && client.salt !== salt) {
      throw new ClientInvalidError();
    }

    if (parseInt(time, 10) + this.expirationTime < new Date().getTime()) {
      throw new TokenExpiredError();
    }

    return text;
  }
}

export class ClientInvalidError extends CustomError {
  constructor() {
    super("The provided client doesn't match the client of the key.");
  }
}

export class TokenExpiredError extends CustomError {
  constructor() {
    super('The token is expired.');
  }
}
