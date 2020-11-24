import React from 'react';
import './index.scss';
import classnames from 'classnames';
import { AppProps } from '../../models/app';
import hotkeys from '../../services/hotkeys';

export default class Sidebar extends React.PureComponent<AppProps> {

  componentDidMount() {
    hotkeys.registerCommand(
      'Cmd:ToggleSideBar',
      () => this.props.toggleSidebar()
    );
  }

  componentDidUpdate() {
    const root = document.documentElement;
    if (this.props.sidebarOpened) {
      root.style.setProperty('--sidebar-width', '200px');
    } else {
      root.style.setProperty('--sidebar-width', '0px');
    }
  }

  render() {
    const {sidebarOpened} = this.props;
    return (
      <div className="sidebar">
        <div className={classnames(
          "content",
          sidebarOpened ? '' : 'hide'
        )}>
        </div>
      </div>
    );
  }
}
