import * as React from 'react';
import { observer } from 'mobx-react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import store, { Screen } from '../../app/app.store';

@observer
export default class GuideBase extends React.Component<P> {
  continueButtonClicked = () => {
    store.setScreen(this.props.continueScreen);
  };
  render() {
    return (
      <Grid
        container
        style={{ height: '100%', textAlign: 'center' }}
        direction="row"
        alignItems="center"
        justify="center"
      >
        <Grid
          item
          style={{ height: '90%', maxHeight: 400, width: '75%', maxWidth: 800 }}
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="space-between"
        >
          <Grid item>
            <h1>{this.props.title}</h1>
          </Grid>
          <Grid item>
            <p>{this.props.subtitle}</p>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={this.continueButtonClicked}
            >
              Doorgaan
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

interface P {
  title: string;
  subtitle: string;
  continueScreen: Screen;
}
