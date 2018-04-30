import * as Router from 'koa-router';
import koaCombineRouters = require('koa-combine-routers');
import status from '../providers/status';
import authentication, { addAuthenticationState } from './oauth2';
import user from './user';

const router = new Router();

router.get('/', ctx => {
  ctx.body = status();
});

export default [
  addAuthenticationState,
  koaCombineRouters([router, authentication, user]),
];
