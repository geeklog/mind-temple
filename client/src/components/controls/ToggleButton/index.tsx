import React from 'react';
import Icon from '../Icon';
import classnames from 'classnames';
import './index.scss';
interface Props {
  on: boolean | string;
  btns: [string, string] | string[];
  values?: [boolean, boolean] | string[];
  onToggle: (value: boolean | string) => void;
  toggleOnMouseOver?: boolean;
  className?: string;
}

function nextValue(values: any[], currValue: boolean | string) {
  if (typeof currValue === 'boolean') {
    return !currValue;
  } else {
    let currIndex = values.indexOf(currValue as string);
    currIndex = currIndex + 1;
    if (currIndex >= values.length) {
      currIndex = 0;
    }
    return values[currIndex];
  }
}

function btn(btns: string[], values: string[] | [boolean, boolean], value: boolean | string) {
  if (typeof value === 'boolean') {
    return btns[value ? 1 : 0];
  } else {
    return btns[((values || btns) as string[]).indexOf(value as string)];
  }
}

export default class ToggleButton extends React.PureComponent<Props> {

  state = {
    mouseover: false
  };

  onClick = () => {
    const {on, onToggle, btns, values} = this.props;
    onToggle(nextValue(values || btns, on));
  }

  onMouseOver = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    this.setState({mouseover: true});
  }

  onMouseOut = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    this.setState({mouseover: false});
  }

  render() {
    const {on, btns, values, className, toggleOnMouseOver} = this.props;
    const {mouseover} = this.state;
    const nextBtn = btn(
      btns,
      values,
      (toggleOnMouseOver && mouseover) ? nextValue(values || btns, on) : on
    );
    return (
      <span
        className={classnames(
          className,
          'toggle-button',
          'state-' + on
        )}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        onClick={this.onClick}
      >
        <Icon
          name={nextBtn}
        />
      </span>
    );
  }
}
