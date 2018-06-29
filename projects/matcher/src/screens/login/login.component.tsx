import * as React from 'react';
import { observer } from 'mobx-react';
import t from '../../texts/all';

@observer
export default class LoginScreen extends React.Component {
  authUrl =
    'https://test.api.iffr.com/oauth2/auth?response_type=code&client_id=matcher';

  anonymousLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    alert(
      'In dit prototype is het nog niet mogelijk de applicatie te gebruiken zonder in te loggen.',
    );
  };

  render() {
    return (
      <div>
        <a href={this.authUrl}>{t('login.myiffr')}</a>
        <a href={this.authUrl + '&service=facebook'}>{t('login.facebook')}</a>
        <a href={'#'} onClick={this.anonymousLogin}>
          {t('login.anonymous')}
        </a>
      </div>
    );
  }
}
