import * as React from 'react';
import { observer } from 'mobx-react';

@observer
export default class PlanningScreen extends React.Component {
  render() {
    return (
      <div>
        <p>
          Als je een aantal films aan je favorieten hebt toegevoegd, kunnen wij
          deze indelen in je agenda.
        </p>
      </div>
    );
  }
}
