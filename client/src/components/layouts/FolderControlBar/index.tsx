import React, { PureComponent } from 'react';
import { AppProps } from '../../../models/app';
import Button from '../../controls/Button';
import MenuButtonGroup from '../../controls/MenuButtonGroup';
import ToggleButton from '../../controls/ToggleButton';
import './index.scss';

export default class FolderControlBar extends PureComponent<AppProps> {

  onNewFileBtnClick = () => {
    const {currFile, createNewItem, getNextAvaliableFileName} = this.props;
    console.log('currFile', currFile);
    createNewItem({
      filePath: currFile.path,
      newName: getNextAvaliableFileName('Untitled'),
      type: 'file'
    });
  }

  onNewFolderBtnClick = () => {
    const {currFile, createNewItem, getNextAvaliableFileName} = this.props;
    createNewItem({
      filePath: currFile.path,
      newName: getNextAvaliableFileName('Untitled'),
      type: 'folder'
    });
  }

  render() {
    const {
      showHiddenFiles,
      setLayoutMode,
      toggleHiddenFiles,
    } = this.props;
    return (
      <div className="folder-control-bar">
        <Button
          icon="file-plus"
          onClick={this.onNewFileBtnClick}
        />
        <Button
          icon="folder-plus"
          onClick={this.onNewFolderBtnClick}
        />
        <MenuButtonGroup
          btns={['grid', 'list', 'monitor']}
          choices={['grid', 'list', 'gallery']}
          onSelected={setLayoutMode}
        />
        <ToggleButton
          on={showHiddenFiles}
          btns={['eye-off', 'eye']}
          onToggle={toggleHiddenFiles}
          toggleOnMouseOver={true}
        />
      </div>
    );
  }
}
