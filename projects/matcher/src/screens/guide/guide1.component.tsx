import * as React from 'react';
import { observer } from 'mobx-react';
import t from '../../texts/all';
import GuideBase from './base.component';
import { Screen } from '../../app/app.store';

@observer
export default class Guide1Screen extends React.Component {
  render() {
    return (
      <GuideBase
        title={t('welcome.heading')}
        subtitle={t('welcome.text')}
        continueScreen={Screen.Guide2}
      />
    );
  }
}
