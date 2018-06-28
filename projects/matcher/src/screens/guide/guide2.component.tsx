import * as React from 'react';
import { observer } from 'mobx-react';
import t from '../../texts/all';
import GuideBase from './base.component';
import { Screen } from '../../app/app.store';

@observer
export default class Guide2Screen extends React.Component {
  render() {
    return (
      <GuideBase
        title={t('explanation1.heading')}
        subtitle={t('explanation1.text')}
        continueScreen={Screen.Guide3}
      />
    );
  }
}
