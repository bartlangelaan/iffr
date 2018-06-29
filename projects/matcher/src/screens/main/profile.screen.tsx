import * as React from 'react';
import { observer } from 'mobx-react';
import store from '../../app/app.store';

@observer
export default class ProfileScreen extends React.Component {
  render() {
    return <button onClick={store.unauthorize}>Log uit</button>;
  }
}
