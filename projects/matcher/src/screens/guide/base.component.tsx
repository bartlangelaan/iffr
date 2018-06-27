import * as React from 'react';
import { observer } from 'mobx-react';
import store, { Screen } from '../../app/app.store';

@observer
export default class GuideBase extends React.Component<P> {
  continueButtonClicked = () => {
    store.setScreen(this.props.continueScreen);
  };
  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <p>{this.props.subtitle}</p>
        <button onClick={this.continueButtonClicked}>Next ></button>
      </div>
    );
  }
}

interface P {
  title: string;
  subtitle: string;
  continueScreen: Screen;
}
