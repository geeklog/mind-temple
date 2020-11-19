import React, { PureComponent } from 'react';
import classnames from 'classnames';
import './index.scss';

interface Props {
  opened: boolean;
  className?: string;
}

export default class RightPane extends PureComponent<Props> {
  render() {
    const { className, opened } = this.props;
    return (
      <div className={classnames(
        'right-pane',
        opened ? '' : 'hide',
        className
      )}>
        {this.props.children}
      </div>
    );
  }
}
