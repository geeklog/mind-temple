import React from 'react';
import './index.scss';
import FilePreviewListItem from './FilePreviewListItem';
import { AppProps, connectAppControl } from '../../../models/app';
import Label from '../../controls/Label';
import ToggleButton from '../../controls/ToggleButton';
import prettyBytes from 'pretty-bytes';
import { FileDesc } from '../../../models/file';
import { cmp } from 'mikov';
import { format } from 'date-fns';

class Header extends React.PureComponent<{
  name: string,
  asc: string,
  onSort: (asc: string) => void
}> {

  state = {asc: false};

  onToggle = (b: boolean) => {
    this.setState({asc: b});
    this.props.onSort(b ? 'asc' : 'desc');
  }

  render() {
    const {name, asc} = this.props;
    return (
      <div className="header">
        <Label
          text={name}
        />
        <ToggleButton
          btns={['chevron-down', 'chevron-up']}
          on={(asc !== undefined) ? (asc === 'asc') : (this.state.asc)}
          onToggle={this.onToggle}
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

  onSortByName =  (order: string) => {
    this.props.sortCurrFolder('name', order);
  }

  onSortByTime =  (order: string) => {
    this.props.sortCurrFolder('time', order);
  }

  onSortBySize =  (order: string) => {
    this.props.sortCurrFolder('size', order);
  }

  render() {
    const {showingFiles, currIndex, currSort} = this.props;

    let files = showingFiles;
    if (currSort.name) {
      files = showingFiles.sort((f1, f2) => {
        return (currSort.name === 'asc' ? 1 : -1) * f1.name.localeCompare(f2.name);
      });
    }
    if (currSort.size) {
      files = showingFiles.sort((f1, f2) => {
        return (currSort.size === 'asc' ? 1 : -1) * cmp(f1.size, f2.size);
      });
    }
    if (currSort.time) {
      files = showingFiles.sort((f1, f2) => {
        return (currSort.time === 'asc' ? 1 : -1) * cmp(new Date(f1.mtime).getTime(), new Date(f2.mtime).getTime());
      });
    }

    return (
      <div className="files-layout-list">
        <div className="headers">
          <Header
            name="Name"
            asc={currSort.name}
            onSort={this.onSortByName}
          />
          <Header
            name="Modified Time"
            asc={currSort.time}
            onSort={this.onSortByTime}
          />
          <Header
            name="Size"
            asc={currSort.size}
            onSort={this.onSortBySize}
          />
        </div>
        <div className="contents">
          <div className="column">
            {files.map((file, i) =>
              <FilePreviewListItem
                key={file.path}
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
            {files.map((file, i) =>
              <Label
                key={i}
                className="cell date"
                selected={currIndex === i}
                text={`${file.mtime ? format(new Date(file.mtime), 'yyyy-MM-dd HH:mm:ss') : '~'}`}
              />
            )}
          </div>
          <div className="column">
            {files.map((file, i) =>
              <Label
                key={i}
                className="cell size"
                selected={currIndex === i}
                text={`${prettyBytes(file.size || 0)}`
              }/>
            )}
          </div>
        </div>
    </div>
    );
  }
}

export default connectAppControl(FilePreviewListLayout);
