import React, { PureComponent } from 'react'
import Icon from '../Icon';

interface Props {
  on: boolean;
  btns: [string, string];
  onToggle: (value: boolean) => void;
  className?: string;
}

export default class ToggleButton extends PureComponent<Props> {
  
  onClick = () => {
    const {on, onToggle} = this.props;
    onToggle(!on);
  }

  render() {
    const {on, btns, className} = this.props;
    return (
      <span className={className} onClick={this.onClick}>
        <Icon
          name={btns[on ? 1 : 0]}
          className="menu-icon"
        />
      </span>
    )
  }
}