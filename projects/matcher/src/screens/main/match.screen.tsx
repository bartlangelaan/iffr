import * as React from 'react';
import { observer } from 'mobx-react';
import store from '../../app/app.store';
import Button from '@material-ui/core/Button';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { Grid, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';

@observer
export default class MatchScreen extends React.Component {
  render() {
    const s = store.suggestion ? store.suggestion.suggestion : null;
    const title = s ? s.title : null;
    const description = s
      ? typeof s.description['a-tot-z'] === 'object'
        ? s.description['a-tot-z']!.dutch
        : null
      : null;

    const actionsDisabled = !s || store.changingFavorite.indexOf(s.id) !== -1;
    return (
      <Grid
        item
        container
        style={{
          maxWidth: 800,
          width: '80%',
          margin: '0 auto',
        }}
        justify={'space-between'}
        direction="column"
        spacing={40}
        wrap="nowrap"
      >
        <Grid
          item
          style={{ flexGrow: 1, width: '100%', overflow: 'scroll', height: 0 }}
        >
          <h1>{s ? s.title : 'Laden...'}</h1>
          <p>{description}</p>
        </Grid>
        <Grid item container direction="row" justify="space-around">
          <Grid item xs={4}>
            <MuiThemeProvider theme={redTheme}>
              <Button
                onClick={() => store.dislike(s!.id)}
                disabled={actionsDisabled}
                color="primary"
                variant="raised"
                style={{ width: '100%' }}
              >
                <Grid container direction="column">
                  <Grid item>
                    <ThumbDownIcon />
                  </Grid>
                  <Grid>Niet leuk</Grid>
                </Grid>
              </Button>
            </MuiThemeProvider>
          </Grid>
          <Grid item xs={4}>
            <MuiThemeProvider theme={greenTheme}>
              <Button
                onClick={() => store.like(s!.id)}
                disabled={actionsDisabled}
                variant="raised"
                color="primary"
                style={{ width: '100%' }}
              >
                <Grid container direction="column">
                  <Grid item>
                    <ThumbUpIcon />
                  </Grid>
                  <Grid>Leuk</Grid>
                </Grid>
              </Button>
            </MuiThemeProvider>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
const redTheme = createMuiTheme({
  palette: {
    primary: {
      main: red[500],
    },
  },
});

const greenTheme = createMuiTheme({
  palette: {
    primary: {
      main: green[600],
    },
  },
});
