import React, { PureComponent } from 'react';
import classnames from 'classnames';
import './index.scss';
import ToggleButton from '../controls/ToggleButton';
import { AppProps } from '../../models/app';

export default class RightPane extends PureComponent<AppProps> {
  render() {
    const { rightPaneOpened } = this.props;
    return (
      <div className={classnames(
        'right-pane',
        rightPaneOpened ? '' : 'hide',
      )}>
        <ToggleButton
          className="dim"
          on={this.props.rightPaneOpened}
          btns={['chevrons-left', 'chevrons-right']}
          onToggle={this.props.toggleRightPane}
        />
        <div className="content">
          {this.props.children}
        </div>
      </div>
    );
  }
}
