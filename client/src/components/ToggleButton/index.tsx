import React, { PureComponent } from 'react'
import Icon from '../Icon';

interface Props {
  on: boolean;
  btns: [string, string];
  onToggle: (value: boolean) => void;
}

export default class ToggleButton extends PureComponent<Props> {
  
  onClick = () => {
    const {on, onToggle} = this.props;
    onToggle(!on);
  }

  render() {
    const {on, btns} = this.props;
    return (
      <span onClick={this.onClick}>
        <Icon
          name={btns[on ? 1 : 0]}
          className="menu-icon"
        />
      </span>
    )
  }
}