import React from 'react';
import './index.scss';
import classnames from 'classnames';
import { AppProps } from '../../models/app';
import hotkeys from '../../services/hotkeys';
import FileListItem from '../layouts/FilePreviewListLayout/FileListItem';

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
    const {sidebarOpened, favorites, getFileColor} = this.props;
    return (
      <div className="sidebar">
        <div className={classnames(
          "content",
          sidebarOpened ? '' : 'hide'
        )}>
          <div className="title"><span className="emoji">❤️</span>Favorites</div>
          {favorites.map((fav, i) => {
            const file = fav.file;
            return (
              <div className="fav-item">
                <FileListItem
                  className={classnames('file-item')}
                  key={file.path}
                  color={getFileColor(file.path)}
                  file={file}
                  index={i}
                  selected={false}
                  dragging={false}
                  dropping={false}
                  text={file.name}
                  icon={25}
                  isFileName={true}
                />
              </div>
            );
          }
          )}
        </div>
      </div>
    );
  }
}
