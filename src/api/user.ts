import * as Router from 'koa-router';
import user from '../providers/user';

const router = new Router({
  prefix: '/user',
});

router.get('/', async ctx => {
  const { userUuid } = ctx.state;
  if (!userUuid) {
    ctx.throw(403);
    return;
  }
  ctx.body = {
    user: await user.getUser(userUuid),
  };
});

export default router;
