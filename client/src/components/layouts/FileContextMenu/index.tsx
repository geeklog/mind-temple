import React, { PureComponent } from 'react';
import classnames from 'classnames';
import Icon from '../../controls/Icon';
import { AppProps } from '../../../models/app';
import './index.scss';
import { boundsInScreen } from '../../../utils/domUtils';

type LiMouseEvent = React.MouseEvent<HTMLLIElement, MouseEvent>;

export default class FileContextMenu extends PureComponent<AppProps> {
  ul: HTMLUListElement;

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
    const {selectedFiles, trash} = this.props;
    trash(selectedFiles);
  }

  download = (event: LiMouseEvent) => {
    //
  }

  hide = () => {
    this.props.toggleFileContextMenu({visible: false});
  }

  componentDidMount() {
    document.addEventListener('click', this.hide);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hide);
  }

  componentDidUpdate() {
    if (!this.ul) {
      return;
    }
    const {fileContextMenu: {x, y}} = this.props;
    const pos = boundsInScreen(this.ul, {x, y, padding: 20});
    this.ul.style.left = `${pos.x}px`;
    this.ul.style.top = `${pos.y}px`;
  }

  render() {
    const {fileContextMenu: {visible}} = this.props;
    const visibleClassed = visible ? '' : 'hide';
    return (
      <ul
        className={classnames('file-context-menu', visibleClassed)}
        ref={ref => this.ul = ref}
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
