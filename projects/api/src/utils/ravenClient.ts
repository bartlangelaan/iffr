import * as Raven from 'raven';

const { RAVEN_DSN } = process.env;
export default Raven.config(RAVEN_DSN, {
  autoBreadcrumbs: true,
  captureUnhandledRejections: true,
});
