import React, { PureComponent } from 'react';
import classnames from 'classnames';
import './index.scss';
import { AppProps } from '../../models/app';

export default class RightPane extends PureComponent<AppProps> {
  render() {
    const { rightPaneOpened } = this.props;
    return (
      <div className={classnames(
        'right-pane',
        rightPaneOpened ? '' : 'hide',
      )}>
        <div className="content">
          {this.props.children}
        </div>
      </div>
    );
  }
}
