import * as Router from 'koa-router';
import user from '../providers/user';
import ttUser from '../services/tickettrigger/user';

const router = new Router({
  prefix: '/user',
});

router.get('/list', async ctx => {
  if (!ctx.state.permissions.includes('users.view')) {
    ctx.throw(403);
    return;
  }
  ctx.body = await ttUser.query(ctx.query.query);
});

router.get('/:userId', async ctx => {
  const { userUuid, permissions } = ctx.state;
  let { userId } = ctx.params;

  // If the user is requesting info about himself, ensure a user
  // is actually connecting and has permission to do that.
  if (userId === 'me') {
    if (!userUuid || !permissions.includes('user.view')) {
      ctx.throw(403);
      return;
    }
    userId = userUuid;
  } else if (!permissions.includes('users.view')) {
    // If it isn't requesting itself, it needs permission to view all users. If
    // that isn't allowed, return a 403 response.
    throw ctx.throw(403);
  }

  ctx.body = {
    user: await user.getUser(userId),
  };
});

export default router;
