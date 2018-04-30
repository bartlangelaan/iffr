import app from './app';
import router from './api/router';

router.forEach(middleware => app.use(middleware));

app.listen(3000);
