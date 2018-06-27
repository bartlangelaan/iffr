import * as React from 'react';
import { observer } from 'mobx-react';
import store from './app.store';

@observer
export default class App extends React.Component {

  render() {
    return `Currently on page ${store.screen}.`;
  }
}