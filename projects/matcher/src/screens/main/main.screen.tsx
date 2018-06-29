import * as React from 'react';
import { observer } from 'mobx-react';
import store, { Screen } from '../../app/app.store';
import MatchScreen from './match.screen';
import PlanningScreen from './planning.screen';
import ProfileScreen from './profile.screen';

@observer
export default class MainScreen extends React.Component {
  openMatchTab = () => {
    store.setScreen(Screen.Matching);
  };

  openPlanningTab = () => {
    store.setScreen(Screen.Planning);
  };

  openProfileTab = () => {
    store.setScreen(Screen.Profile);
  };

  render() {
    // tslint:disable-next-line:variable-name
    let ScreenComponent: React.ComponentType;
    if (store.screen === Screen.Matching) ScreenComponent = MatchScreen;
    else if (store.screen === Screen.Planning) ScreenComponent = PlanningScreen;
    else if (store.screen === Screen.Profile) ScreenComponent = ProfileScreen;
    else return 'Screen not found!';

    return (
      <div>
        <p>
          <button onClick={this.openMatchTab}>Matchen</button>
          <button onClick={this.openPlanningTab}>Plannen</button>
          <button onClick={this.openProfileTab}>Profiel</button>
        </p>
        <ScreenComponent />
      </div>
    );
  }
}
