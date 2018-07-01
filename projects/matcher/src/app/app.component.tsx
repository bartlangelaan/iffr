import * as React from 'react';
import { observer } from 'mobx-react';
import CssBaseline from '@material-ui/core/CssBaseline';
import store, { Screen } from './app.store';
import Guide1Screen from '../screens/guide/guide1.component';
import Guide2Screen from '../screens/guide/guide2.component';
import Guide3Screen from '../screens/guide/guide3.component';
import LoginScreen from '../screens/login/login.component';
import MainScreen from '../screens/main/main.screen';

@observer
export default class App extends React.Component {
  render() {
    // tslint:disable-next-line:variable-name
    let ScreenComponent: React.ComponentType = MainScreen;
    if (store.screen === Screen.Guide1) ScreenComponent = Guide1Screen;
    if (store.screen === Screen.Guide2) ScreenComponent = Guide2Screen;
    if (store.screen === Screen.Guide3) ScreenComponent = Guide3Screen;
    if (store.screen === Screen.Login) ScreenComponent = LoginScreen;
    return (
      <React.Fragment>
        <CssBaseline />
        <ScreenComponent />
      </React.Fragment>
    );
  }
}
