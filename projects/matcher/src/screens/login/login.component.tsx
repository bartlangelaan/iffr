import * as React from 'react';
import { observer } from 'mobx-react';

@observer
export default class LoginScreen extends React.Component {
  authUrl =
    'https://test.api.iffr.com/oauth2/auth?response_type=code&client_id=filmmatcher';

  anonymousLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    alert(
      'In dit prototype is het nog niet mogelijk de applicatie te gebruiken zonder in te loggen.',
    );
  };

  render() {
    return (
      <div>
        <a href={this.authUrl}>Login</a>
        <a href={'#'} onClick={this.anonymousLogin}>
          Doorgaan zonder inloggen
        </a>
      </div>
    );
  }
}
