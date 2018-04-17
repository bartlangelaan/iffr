import app from './app';
import router from './api/router';

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
