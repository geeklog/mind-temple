import React, { PureComponent } from 'react';
import './index.scss';
import classnames from 'classnames';
import Icon from '../Icon';

interface Props {
  label?: string;
  icon?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default class Button extends PureComponent<Props> {

  onClick = () => {
    if (this.props.disabled) {
      return;
    }
    this.props.onClick?.();
  }

  render() {
    let {label, icon, className, disabled} = this.props;
    return (
      <button
        className={classnames(
          'button',
          className,
          disabled ? 'disabled' : ''
        )}
        onClick={this.onClick}
      >
        {icon && <Icon name={icon}/>}
        {label}
      </button>
    );
  }
}
