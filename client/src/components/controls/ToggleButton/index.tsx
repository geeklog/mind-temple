import React from 'react';
import Icon from '../Icon';
import classnames from 'classnames';

interface Props {
  on: boolean;
  btns: [string, string];
  onToggle: (value: boolean) => void;
  toggleOnMouseOver?: boolean;
  className?: string;
}

export default class ToggleButton extends React.PureComponent<Props> {

  state = {
    mouseover: false
  };

  onClick = () => {
    const {on, onToggle} = this.props;
    onToggle(!on);
  }

  onMouseOver = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    this.setState({mouseover: true});
  }

  onMouseOut = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    this.setState({mouseover: false});
  }

  render() {
    const {on, btns, className, toggleOnMouseOver} = this.props;
    const {mouseover} = this.state;
    return (
      <span
        className={classnames(
          className,
          'toggle-button'
        )}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        onClick={this.onClick}
      >
        <Icon
          name={btns[((toggleOnMouseOver && mouseover) ? !on : on) ? 1 : 0]}
        />
      </span>
    );
  }
}
