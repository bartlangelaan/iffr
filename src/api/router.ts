import * as Router from 'koa-router';
import koaCombineRouters = require('koa-combine-routers');
import status from '../providers/status';
import authentication from './oauth2';

const router = new Router();

router.get('/', ctx => {
  ctx.body = status();
});

export default koaCombineRouters([router, authentication]);
