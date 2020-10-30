import React from 'react';

interface Props {
  name: string;
  className: string;
  onClick?: (event: any) => void;
}

function Icon({name, className, onClick}: Props) {
  return (
    <svg className={`icon icon-${name} ${className || ''}`} onClick={onClick}>
      <use xlinkHref={`icons.svg#icon-${name}`}></use>
    </svg>
  )
}

export default Icon;
