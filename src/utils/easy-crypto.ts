import { createCipher, createDecipher, Cipher, Decipher } from 'crypto';

const algorithm = 'aes-128-cbc';
const inputEncoding = 'utf8';
const outputEncoding = 'hex';

/**
 * This class makes it easy to encrypt and decrypt text to an unreadable code.
 */
export default class EasyCrypto {
  private password: string;

  constructor(password: string) {
    this.password = password;
  }

  public encrypt(text: string): string {
    const cipher = createCipher(algorithm, this.password);
    return (
      cipher.update(text, inputEncoding, outputEncoding) +
      cipher.final(outputEncoding)
    );
  }

  public decrypt(token: string): string {
    const decipher = createDecipher(algorithm, this.password);
    return (
      decipher.update(token, outputEncoding, inputEncoding) +
      decipher.final(inputEncoding)
    );
  }
}
