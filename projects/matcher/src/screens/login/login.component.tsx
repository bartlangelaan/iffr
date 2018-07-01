import * as React from 'react';
import { observer } from 'mobx-react';
import t from '../../texts/all';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

@observer
export default class LoginScreen extends React.Component<{}, LoginScreenState> {
  authUrl =
    'https://test.api.iffr.com/oauth2/auth?response_type=code&client_id=matcher';

  state: LoginScreenState = {
    dialog: false,
  };

  anonymousLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    this.setState({
      dialog: true,
    });
  };

  closeDialog = () => {
    this.setState({ dialog: false });
  };

  render() {
    const { dialog } = this.state;
    return (
      <React.Fragment>
        <Grid
          container
          style={{ height: '100%', textAlign: 'center' }}
          direction="row"
          alignItems="center"
          justify="center"
        >
          <Grid item style={{ width: '75%', maxWidth: 800 }}>
            <p>
              <Button href={this.authUrl} variant="contained" color="primary">
                {t('login.myiffr')}
              </Button>
            </p>
            <p>
              <Button
                href={this.authUrl + '&service=facebook'}
                onClick={this.anonymousLogin}
                variant="contained"
                color="secondary"
              >
                {t('login.facebook')}
              </Button>
            </p>
            <p>
              <Button
                href={'#'}
                onClick={this.anonymousLogin}
                variant="contained"
              >
                {t('login.anonymous')}
              </Button>
            </p>
          </Grid>
        </Grid>
        <Dialog
          open={dialog}
          onClose={this.closeDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Prototype</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Het is in het prototype nog niet mogelijk om in te loggen met
              Facebook of zonder account door te gaan. Gebruik alsjeblieft een
              MyIFFR-account.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeDialog} color="primary" autoFocus>
              Okay
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

interface LoginScreenState {
  dialog: boolean;
}
