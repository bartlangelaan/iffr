import * as React from 'react';
import { observer } from 'mobx-react';
import t from '../../texts/all';
import GuideBase from './base.component';
import { Screen } from '../../app/app.store';

@observer
export default class Guide3Screen extends React.Component {
  render() {
    return (
      <GuideBase
        title={t('explanation2.heading')}
        subtitle={t('explanation2.text')}
        continueScreen={Screen.Login}
      />
    );
  }
}
