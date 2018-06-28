import * as React from 'react';
import { observer } from 'mobx-react';
import store, { Screen } from './app.store';
import Guide1Screen from '../screens/guide/guide1.component';
import Guide2Screen from '../screens/guide/guide2.component';
import Guide3Screen from '../screens/guide/guide3.component';
import LoginScreen from '../screens/login/login.component';

@observer
export default class App extends React.Component {
  render() {
    if (store.screen === Screen.Guide1) return <Guide1Screen />;
    if (store.screen === Screen.Guide2) return <Guide2Screen />;
    if (store.screen === Screen.Guide3) return <Guide3Screen />;
    if (store.screen === Screen.Login) return <LoginScreen />;
    return `Currently on page ${store.screen}.`;
  }
}
