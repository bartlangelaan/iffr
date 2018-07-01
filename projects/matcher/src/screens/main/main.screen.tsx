import * as React from 'react';
import { observer } from 'mobx-react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import store, { Screen } from '../../app/app.store';
import MatchScreen from './match.screen';
import PlanningScreen from './planning.screen';
import ProfileScreen from './profile.screen';
import { Grid } from '@material-ui/core';

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
      <Grid
        container
        direction="column"
        style={{ height: '100%' }}
        wrap="nowrap"
      >
        <Grid item>
          <AppBar position="static">
            <Tabs
              value={store.screen}
              onChange={(_, screen: Screen) => store.setScreen(screen)}
              centered
            >
              <Tab label="Matchen" value={Screen.Matching} />
              <Tab label="Plannen" value={Screen.Planning} />
              <Tab label="Profiel" value={Screen.Profile} />
            </Tabs>
          </AppBar>
        </Grid>
        <Grid item style={{ flexGrow: 1 }} container>
          <ScreenComponent />
        </Grid>
      </Grid>
    );
  }
}
