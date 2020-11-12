import React from 'react';
import Icon from '../Icon';
import deepEquals from 'deep-equal';

interface Props {
  on: boolean;
  btns: [string, string];
  onToggle: (value: boolean) => void;
  className?: string;
}

export default class ToggleButton extends React.Component<Props> {

  onClick = () => {
    const {on, onToggle} = this.props;
    onToggle(!on);
  }

  shouldComponentUpdate(prevProps: Props) {
    return !deepEquals(prevProps, this.props);
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
    );
  }
}
