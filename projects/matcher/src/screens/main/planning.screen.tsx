import * as React from 'react';
import { observer } from 'mobx-react';
import Checkbox from '@material-ui/core/Checkbox';
import store from '../../app/app.store';
import { Button } from '@material-ui/core';

@observer
export default class PlanningScreen extends React.Component<
  {},
  PlanningScreenState
> {
  state: PlanningScreenState = {
    checked: [],
  };

  toggle = (id: string) => {
    if (this.state.checked.includes(id)) {
      this.setState({
        checked: this.state.checked.filter(i => i !== id),
      });
    } else {
      this.setState({
        checked: [...this.state.checked, id],
      });
    }
  };

  render() {
    return (
      <div style={{ width: '90%', maxWidth: 700, margin: '0 auto' }}>
        <p>
          Als je een aantal films aan je favorieten hebt toegevoegd, kunnen wij
          deze indelen in je agenda.
        </p>
        <p>
          Welke favorieten wil je zeker bezoeken? Selecteer ze hieronder, dan
          geven wij die voorang.
        </p>
        <ul>
          {store.favorites &&
            store.favorites.likes.map(l => (
              <li>
                <label htmlFor={l.id}>
                  <Checkbox
                    type="checkbox"
                    name={l.id}
                    onClick={() => this.toggle(l.id)}
                  />
                  {l.id}
                </label>
              </li>
            ))}
        </ul>
        <Button variant="raised" color="primary" style={{ marginBottom: 50 }}>
          Plannen
        </Button>
      </div>
    );
  }
}

interface PlanningScreenState {
  checked: string[];
}
