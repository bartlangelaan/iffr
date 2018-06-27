import * as React from 'react';
import { observer } from 'mobx-react';
import store, { Screen } from './app.store';
import Guide1Screen from '../screens/guide/guide1.component';

@observer
export default class App extends React.Component {
  render() {
    if (store.screen === Screen.Guide1) return <Guide1Screen />;
    return `Currently on page ${store.screen}.`;
  }
}
