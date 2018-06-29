import * as React from 'react';
import { observer } from 'mobx-react';
import store from '../../app/app.store';

@observer
export default class ProfileScreen extends React.Component {
  render() {
    return (
      <div>
        <p>Naam: {store.user ? store.user.name.first : null}</p>
        <p>Geboortedatum: {store.user ? store.user.birthday : null}</p>
        <button onClick={store.unauthorize}>Log uit</button>
        <hr />
        <p>Beschikbaarheid IFFR</p>
        <p>
          <i>Niet beschikbaar in prototype.</i>
        </p>
        <hr />
        <p>
          Films geliked: {store.favorites ? store.favorites.likes.length : null}
        </p>
        <p>
          Films gedisliked:{' '}
          {store.favorites ? store.favorites.dislikes.length : null}
        </p>
      </div>
    );
  }
}
