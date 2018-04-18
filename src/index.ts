import app from './app';
import router from './api/router';

app.use(router);

app.listen(3000);
