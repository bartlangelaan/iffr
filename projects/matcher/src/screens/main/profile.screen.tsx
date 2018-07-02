import * as React from 'react';
import { observer } from 'mobx-react';
import store from '../../app/app.store';
import { Button } from '@material-ui/core';

@observer
export default class ProfileScreen extends React.Component {
  render() {
    return (
      <div
        style={{
          margin: '0 auto',
          width: '90%',
          maxWidth: 400,
          fontSize: 18,
        }}
      >
        <p>
          <b>Naam</b>: {store.user ? store.user.name.first : null}
        </p>
        <p>
          <b>Geboortedatum</b>: {store.user ? store.user.birthday : null}
        </p>
        <Button onClick={store.unauthorize} variant="outlined">
          Log uit
        </Button>
        <hr />
        <p>
          <b>Beschikbaarheid IFFR</b>
        </p>
        <p>
          <i>Niet beschikbaar in prototype.</i>
        </p>
        <hr />
        <p>
          <b>Films geliked</b>:{' '}
          {store.favorites ? store.favorites.likes.length : null}
        </p>
        <p>
          <b>Films gedisliked</b>:{' '}
          {store.favorites ? store.favorites.dislikes.length : null}
        </p>
      </div>
    );
  }
}
