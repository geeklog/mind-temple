import React, { Component } from 'react'
import classnames from 'classnames';

interface Props {
  path: string;
  index: number;
  solid: boolean;
  onClick?: (index: number) => void;
}

export default class PathIndicator extends Component<Props> {
  
  onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();
    const {index} = this.props;
    this.props.onClick?.(index);
  }

  render() {
    const {path, solid} = this.props;
    const decorator = path === '/' ? 'spliter' : (solid? 'solid': '');
    return (
      <span
        className={classnames('path-indicator', decorator)}
        onClick={this.onClick}
      >
        {path}
      </span>
    )
  }
}
