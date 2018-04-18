import 'dotenv/config';
import { appendFileSync } from 'fs';
import { randomBytes } from 'crypto';

const { env } = process;

function getOrGenerate(key: string, generate: () => string) {
  const entry = env[key];
  if (typeof entry !== 'undefined') return entry;

  const generated = generate();
  appendFileSync(__dirname + '/../../.env', key + '=' + generated + '\n');
  console.warn('Set', key, 'to', generated, 'and saved it to the .env file.');
  return generated;
}

function generateRandom() {
  return randomBytes(5).toString('hex');
}

export function getApiClientSalt(clientId: string) {
  return getOrGenerate(`API_SALT_CLIENT_${clientId}`, generateRandom);
}

export function getApiTokenSalt() {
  return getOrGenerate('API_SALT_TOKEN', generateRandom);
}

export function getApiCodeSalt() {
  return getOrGenerate('API_SALT_CODE', generateRandom);
}
