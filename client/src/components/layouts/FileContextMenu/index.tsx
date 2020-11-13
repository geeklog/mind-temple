import React, { PureComponent } from 'react';
import classnames from 'classnames';
import Icon from '../../controls/Icon';
import { connectAppControl, AppProps } from '../../../models/app';
import './index.scss';

type LiMouseEvent = React.MouseEvent<HTMLLIElement, MouseEvent>;

class FileContextMenu extends PureComponent<AppProps> {

  open = () => {
    const {fileContextMenu: {file}, openInServer} = this.props;
    openInServer(file!);
  }

  showInFolder = () => {
    const {fileContextMenu: {file}, openFolderInServer} = this.props;
    openFolderInServer(file!);
  }

  gotoConsole = () => {
    const {fileContextMenu: {file}, gotoColsoleInServer} = this.props;
    gotoColsoleInServer(file!);
  }

  trash = () => {
    const {fileContextMenu: {file}, trash} = this.props;
    trash(file!);
  }

  download = (event: LiMouseEvent) => {
    //
  }

  componentDidMount() {
    const {toggleFileContextMenu} = this.props as any;
    document.addEventListener('click', () => {
      toggleFileContextMenu(false);
    });
  }

  render() {
    const {fileContextMenu: {visible, x, y}} = this.props;
    const visibleClassed = visible ? '' : 'hide';
    let style = {};
    if (x !== undefined && y !== undefined) {
      style = {
        left: x + 'px',
        top: y + 'px'
      };
    }
    return (
      <ul
        className={classnames('file-context-menu', visibleClassed)}
        style={style}
      >
        <li
          className={classnames('item')}
          onClick={this.open}
        >
          <Icon name="external-link" />
          Open
        </li>
        <li
          className={classnames('item')}
          onClick={this.showInFolder}
        >
          <Icon name="folder" />
          Show in Folder
        </li>
        <li
          className={classnames('item')}
          onClick={this.gotoConsole}
        >
          <Icon name="command" />
          Go to console
        </li>
        <li
          className={classnames('item')}
          onClick={this.trash}
        >
          <Icon name="trash-2" />
          Trash
        </li>
        <li
          className={classnames('item', 'disabled')}
          onClick={this.download}
        >
          <Icon name="download" />
          Download
        </li>
      </ul>
    );
  }
}

export default connectAppControl(FileContextMenu);
