import * as Router from 'koa-router';
import user from '../services/tickettrigger/user';

const router = new Router({
  prefix: '/user',
});

router.get('/', async ctx => {
  const { userUuid } = ctx.state;
  if (!userUuid) {
    ctx.throw(403);
    return;
  }
  ctx.body = await user.getSummary(userUuid);
});

export default router;
