import React, { PureComponent } from 'react';
import classnames from 'classnames';
import './index.scss';

interface Props {
  text: string;
  className?: string;
}

export default class Label extends PureComponent<Props> {
  render() {
    const {text, className} = this.props;
    return (
      <span
        className={classnames(
          'label',
          className
        )}
      >
        {text}
      </span>
    );
  }
}
