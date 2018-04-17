import * as Router from 'koa-router';
import status from '../providers/status';

const router = new Router();

router.get('/', ctx => {
  ctx.body = status();
});

export default router;
