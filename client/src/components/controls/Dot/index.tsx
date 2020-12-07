import React, { PureComponent } from "react";
import classnames from 'classnames';
import './index.scss';

export default class Dot extends PureComponent<{
  color: string,
  onClick?: (color: string) => void
}> {

  onClick = () => {
    const {color, onClick} = this.props;
    onClick?.(color);
  }

  render() {
    const {color} = this.props;
    return (
      <div
        className={classnames("dot", color)}
        onClick={this.onClick}
      />
    );
  }
}
