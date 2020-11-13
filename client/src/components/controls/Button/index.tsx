import React, { PureComponent } from 'react';
import './index.scss';
import classnames from 'classnames';
import Icon from '../Icon';

interface Props {
  label?: string;
  icon?: string;
  onClick?: () => void;
  className?: string;
}

export default class Button extends PureComponent<Props> {

  onClick = () => {
    this.props.onClick?.();
  }

  render() {
    const {label, icon, className} = this.props;
    return (
      <button className={classnames('button', className)} onClick={this.onClick}>
        {icon && <Icon name={icon}/>}
        {label}
      </button>
    );
  }
}
