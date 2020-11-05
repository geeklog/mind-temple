import React, { PureComponent } from 'react'
import Icon from '../Icon';
import './index.scss';
import { AppControl } from '../../App';
import classnames from 'classnames';


export interface ContextMenuProps {
  control: AppControl
  visible: boolean;
  x?: number,
  y?: number
}

export default class FileContextMenu extends PureComponent<ContextMenuProps> {
  
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
        <li>
          <Icon name="external-link" />
          Open
        </li>
        <li>
          <Icon name="folder" />
          Show in Finder
        </li>
        <li>
          <Icon name="command" />
          Go to console
        </li>
        <li>
          <Icon name="download" />
          Download
        </li>
      </ul>
    )
  }
}
