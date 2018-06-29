import * as React from 'react';
import { observer } from 'mobx-react';
import store from '../../app/app.store';

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
      <div>
        <h1>{s ? s.title : 'Laden...'}</h1>
        <p>{description}</p>
        <p>
          <button
            onClick={() => store.dislike(s!.id)}
            disabled={actionsDisabled}
          >
            Niet leuk
          </button>
          <button onClick={() => store.like(s!.id)} disabled={actionsDisabled}>
            Leuk
          </button>
        </p>
      </div>
    );
  }
}
