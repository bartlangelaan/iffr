import * as Router from 'koa-router';
import user from '../providers/user';
import favorites from '../providers/favorites';
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

router.use('/:userId', async (ctx, next) => {
  const { userUuid, permissions } = ctx.state;
  const { userId } = ctx.params;

  // If a server is requesting information about itself without the token providing
  // context about an user, this isn't possible.
  if (userId === 'me' && !userUuid) {
    ctx.throw(400);
    return;
  }

  // If we aren't requestion information about ourselves, we set the userUuid state
  // to the user we're requesting. This way userUuid is always about who we're
  // requesting data of.
  if (userId !== 'me') {
    ctx.state.userUuid = userId;
  }

  // Now, we're adding some extra permissions. If the user is requesting information
  // about itself, we should always use all 'user' permissons. If we're requesting
  // information about someone else, we should use the 'users' permission. Based
  // on that, we duplicate all these permission, but change 'user' or 'users' to
  // 'this_user'. This way, 'this_user' can always be used to check if the client
  // has permission to get / change data of this specific user.
  //
  // For example: if the client has the following permissions:
  // - 'user.edit'
  // - 'users.view'
  //
  // If the client requests 'me', the permission 'this_user.edit' would be added.
  // If the client requests another users data, the permission 'this_user.view' would be added.
  const permissionPrefix = userId === 'me' ? 'user.' : 'users.';
  permissions.forEach(permission => {
    if (permission.startsWith(permissionPrefix)) {
      permissions.push(permission.replace(permissionPrefix, 'this_user.'));
    }
  });

  return next();
});

router.get('/:userId', async ctx => {
  const { userUuid, permissions } = ctx.state;

  // Check if this user can be viewed.
  if (!permissions.includes('this_user.view')) {
    throw ctx.throw(403);
  }

  ctx.body = {
    user: await user.getUser(userUuid!),
  };
});

/**
 * Gets the complete list of favorites, sorted on 'liked' and 'disliked'.
 */
router.get('/:userId/favorites', async ctx => {
  const { userUuid, permissions } = ctx.state;

  // Check if this users likes can be viewed.
  if (!permissions.includes('this_user.favorites.view')) {
    throw ctx.throw(403);
  }

  ctx.body = {
    favorites: await favorites.get(userUuid!),
  };
});

/**
 * Creates a new favorite.
 */
router.post('/:userId/favorites', async ctx => {
  const { userUuid, permissions } = ctx.state;
  const { id, action } = ctx.request.body;

  // Check if this users likes can be edited.
  if (!permissions.includes('this_user.favorites.edit')) {
    throw ctx.throw(403);
  }

  if (typeof id !== 'string') {
    throw ctx.throw(400);
  }
  if (action !== 'like' && action !== 'dislike') {
    throw ctx.throw(400);
  }

  await favorites.add(userUuid!, action, id);

  ctx.status = 200;
});

router.delete('/:userId/favorites', async ctx => {
  const { userUuid, permissions } = ctx.state;
  const { id } = ctx.request.body;

  // Check if this users likes can be edited.
  if (!permissions.includes('this_user.favorites.edit')) {
    throw ctx.throw(403);
  }

  if (typeof id !== 'string') {
    throw ctx.throw(400);
  }

  await favorites.delete(userUuid!, id);

  ctx.status = 200;
});

export default router;
