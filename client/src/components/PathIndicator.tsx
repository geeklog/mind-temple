import React, { Component } from 'react'

interface Props {
  path: string;
  index: number;
  solid: boolean;
  onClick?: (index: number) => void;
}

export default class PathIndicator extends Component<Props> {
  
  onClick = () => {
    const {index} = this.props;
    this.props.onClick?.(index);
  }

  render() {
    const {path, solid} = this.props;
    return (
      <span className={`path-indicator ${solid? 'solid': ''}`} onClick={this.onClick}>{path}</span>
    )
  }
}
