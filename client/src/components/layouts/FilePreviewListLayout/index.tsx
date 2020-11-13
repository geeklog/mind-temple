import React from 'react';
import './index.scss';
import FilePreviewListItem from './FilePreviewListItem';
import { AppProps, connectAppControl } from '../../../models/app';
import Label from '../../controls/Label';
import ToggleButton from '../../controls/ToggleButton';
import prettyBytes from 'pretty-bytes';
import { FileDesc } from '../../../models/file';

class Header extends React.PureComponent<{
  name: string,
  asc: boolean,
  onSort: (asc: boolean) => void
}> {
  render() {
    const {name, asc, onSort} = this.props;
    return (
      <div className="header">
        <Label
          text={name}
        />
        <ToggleButton
          btns={['chevron-down', 'chevron-up']}
          on={asc}
          onToggle={onSort}
        />
      </div>
    );
  }
}

class FilePreviewListLayout extends React.PureComponent<AppProps> {

  onItemClick =  (file: FileDesc, index: number) => {
    this.props.setCurrIndex(index);
  }

  onItemDoubleClick =  (file: FileDesc, index: number) => {
    this.props.open(file);
  }

  onItemContextMenu = (options: {
    visible: boolean; x: number; y: number; index: number; file: FileDesc;
  }) => {
    this.props.toggleFileContextMenu(options);
  }

  onSortByName =  (asc: boolean) => {
    this.props.updateCurrFolder({ sortBy: 'name' });
  }

  onSortByTime =  (asc: boolean) => {
    this.props.updateCurrFolder({ sortBy: 'time' });
  }

  onSortBySize =  (asc: boolean) => {
    this.props.updateCurrFolder({ sortBy: 'size' });
  }

  render() {
    const {showingFiles, currIndex, currSortBy} = this.props;

    return (
      <div className="files-layout-list">
        <div className="column">
          <Header
            name="Name"
            asc={currSortBy === 'name'}
            onSort={this.onSortByName}
          />
          {showingFiles.map((file, i) =>
            <FilePreviewListItem
              key={i}
              file={file}
              index={i}
              selected={currIndex === i}
              onClick={this.onItemClick}
              onDoubleClick={this.onItemDoubleClick}
              onContextMenu={this.onItemContextMenu}
            />
          )}
        </div>
        <div className="column">
          <Header
            name="Time"
            asc={currSortBy === 'time'}
            onSort={this.onSortByTime}
          />
          {showingFiles.map((file, i) =>
            <Label
              key={i}
              className="cell"
              selected={currIndex === i}
              text={`${file.mtime}`}
            />
          )}
        </div>
        <div className="column">
          <Header
            name="Size"
            asc={currSortBy === 'size'}
            onSort={this.onSortBySize}
          />
          {showingFiles.map((file, i) =>
            <Label
              key={i}
              className="cell"
              selected={currIndex === i}
              text={`${prettyBytes(file.size || 0)}`
            }/>
          )}
        </div>
      </div>
    );
  }
}

export default connectAppControl(FilePreviewListLayout);
