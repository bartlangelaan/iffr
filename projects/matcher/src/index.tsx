import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'normalize.css';
import App from './app/app.component';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
