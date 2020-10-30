import React from 'react';

interface Props {
  name: string;
  className?: string;
  onClick?: (event: any) => void;
}

export default class Icon extends React.PureComponent<Props> {
  render() {
    const {name, className, onClick} = this.props;
    return (
      <svg className={`icon icon-${name} ${className || ''}`} onClick={onClick}>
        <use xlinkHref={`icons.svg#icon-${name}`}></use>
      </svg>
    )
  }
}
