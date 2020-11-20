import React from 'react';
import './index.scss';
import classnames from 'classnames';
import { AppProps } from '../../models/app';
import ToggleButton from '../controls/ToggleButton';
import hotkeys from '../../services/hotkeys';

export default class Sidebar extends React.PureComponent<AppProps> {

  componentDidMount() {
    hotkeys.registerCommand(
      'Cmd:ToggleSideBar',
      () => this.props.toggleSidebar()
    );
  }

  render() {
    const {sidebarOpened, toggleSidebar} = this.props;
    return (
      <div className="sidebar">
        <ToggleButton
          className="sidebar-btn dim"
          on={sidebarOpened}
          btns={['chevrons-right', 'chevrons-left']}
          onToggle={toggleSidebar}
        />
        <div className={classnames(
          "content",
          sidebarOpened ? '' : 'hide'
        )}>
        </div>
      </div>
    );
  }
}
