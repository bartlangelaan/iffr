import { Validator } from 'jsonschema';
import { inspect } from 'util';

const { definitions } = require('./api-response-schemas.json');
const validator = new Validator();
Object.keys(definitions).forEach(definitionKey => {
  const definitionId = `/#/definitions/${definitionKey}`;
  definitions[definitionKey].id = definitionId;
  validator.addSchema(definitions[definitionKey], definitionId);
});

export function validate(schema: string, thingToValidate: any) {
  if (!definitions[schema]) {
    throw new Error(`The ${schema} TypeScript type was not found.`);
  }
  const result = validator.validate(thingToValidate, {
    $ref: definitions[schema].id,
  });

  return result;
}

export function assure(schema: string, thingToValidate: any) {
  const result = validate(schema, thingToValidate);
  if (!result.valid) {
    const errString = result.errors
      .map(
        (e, i) =>
          `ERROR ${i + 1}: ${e.toString()}: \n${inspect(e, { colors: true })}`,
      )
      .join('\n');
    throw new Error(
      `An instance of ${schema} is not as expected.\n\n${errString}\n\nFULL INSTANCE:\n\n${thingToValidate}`,
    );
  }
}
