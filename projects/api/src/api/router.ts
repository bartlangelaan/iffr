import * as Router from 'koa-router';
import status from '../providers/status';
import authentication, { addAuthenticationState } from './oauth2';
import user from './user';

const koaCombineRouters = require('koa-combine-routers');

const router = new Router();

router.post('/', ctx => {
  ctx.body = ctx.request.body;
});

export default [
  addAuthenticationState,
  koaCombineRouters([router, authentication, user]),
];
