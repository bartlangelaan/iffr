import { Validator } from 'jsonschema';

const { definitions } = require('./api-response-schemas.json');
const validator = new Validator();
Object.keys(definitions).forEach(definitionKey => {
  const definitionId = `/#/definitions/${definitionKey}`;
  definitions[definitionKey].id = definitionId;
  validator.addSchema(definitions[definitionKey], definitionId);
});

export function validate(schema: string, thingToValidate: any) {
  const result = validator.validate(thingToValidate, {
    $ref: definitions[schema].id,
  });

  return result;
}

export function assure(schema: string, thingToValidate: any) {
  const result = validate(schema, thingToValidate);
  if (!result.valid) {
    const errString = result.errors.map(e => e.toString()).join('\n');
    throw new Error(
      `An instance of ${schema} is not as expected.\n\n` + errString,
    );
  }
}
