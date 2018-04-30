import { Validator } from 'jsonschema';

const schemas = require('./api-response-schemas.json');
const validator = new Validator();

export default function validate(
  schema: string,
  thingToValidate: any,
): boolean {
  const result = validator.validate(
    thingToValidate,
    schemas['definitions'][schema],
  );

  console.log(result);

  return result.valid;
}

export function assure(schema: string, thingToValidate: any) {
  if (!validate(schema, thingToValidate)) {
    throw new Error('Object is not as expected.');
  }
}
