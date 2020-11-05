import React, { PureComponent } from 'react'
import Icon from '../Icon';
import './index.scss';
import { AppControl } from '../../App';
import classnames from 'classnames';
import { FileDesc } from '../../models/file';

type LiMouseEvent = React.MouseEvent<HTMLLIElement, MouseEvent>;

export interface ContextMenuProps {
  file?: FileDesc;
  control: AppControl;
  visible: boolean;
  x?: number;
  y?: number;
}

export default class FileContextMenu extends PureComponent<ContextMenuProps> {
  
  open = () => {
    const {file, control} = this.props;
    control.openInServer(file!);
  }

  showInFolder = () => {
    const {file, control} = this.props;
    control.openFolderInServer(file!);
  }

  gotoConsole = () => {
    const {file, control} = this.props;
    control.gotoColsoleInServer(file!);
  }

  trash = () => {
    const {file, control} = this.props;
    control.trash(file!);
  }

  download = (event: LiMouseEvent) => {

  }
  
  componentDidMount() {
    const {control} = this.props;
    document.addEventListener('click', () => {
      control.toggleFileContextMenu(false);
    })
  }

  render() {
    const {visible, x, y} = this.props;
    const visibleClassed = visible ? '' : 'hide'
    let style = {};
    if (x !== undefined && y !== undefined) {
      style = {
        left: x + 'px',
        top: y + 'px'
      }
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
    )
  }
}
