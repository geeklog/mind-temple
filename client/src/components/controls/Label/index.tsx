import React, { PureComponent } from 'react';
import classnames from 'classnames';
import './index.scss';

interface Props {
  text: string;
  className?: string;
  selected?: boolean;
}

export default class Label extends PureComponent<Props> {
  render() {
    const {text, className, selected} = this.props;
    return (
      <span
        className={classnames(
          'label',
          className,
          selected ? 'selected' : ''
        )}
      >
        {text}
      </span>
    );
  }
}
