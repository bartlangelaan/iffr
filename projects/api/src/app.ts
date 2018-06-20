import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';

const app = new Koa();

app.use(bodyParser());

export default app;
