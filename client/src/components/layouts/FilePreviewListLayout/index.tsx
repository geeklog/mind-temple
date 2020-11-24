import React from 'react';
import './index.scss';
import FilePreviewListItem from './FilePreviewListItem';
import { AppProps, connectAppControl } from '../../../models/app';
import Label from '../../controls/Label';
import ToggleButton from '../../controls/ToggleButton';
import prettyBytes from 'pretty-bytes';
import { FileDesc } from '../../../models/file';
import { format } from 'date-fns';
import hotkeys from '../../../services/hotkeys';
import { ContextMenuOptions } from '../type';
import { isClickOnElement } from '../../../utils/domUtils';

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

  trashCurrFile = () => {
    const {trash, selectedFiles} = this.props;
    trash(selectedFiles);
  }

  onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isClickOnElement(event, 'cell')) {
      return;
    }
    const {setCurrIndex} = this.props;
    setCurrIndex(null);
  }

  onItemClick =  (file: FileDesc, index: number) => {
    const {setCurrIndex, addSelectIndex} = this.props;
    if (hotkeys.metaHolding) {
      console.log('addSelectIndex', index);
      addSelectIndex(index);
    } else {
      setCurrIndex(index);
    }
  }

  onItemDoubleClick =  (file: FileDesc, index: number) => {
    this.props.open(file);
  }

  onItemContextMenu = (options: ContextMenuOptions) => {
    const {setCurrIndex } = this.props;
    const {index} = options;
    setCurrIndex(index);
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

  onFileNameChange = (newFileName: string, file: FileDesc, index: number) => {
    this.props.renameFile({
      filePath: file.path,
      newName: newFileName
    });
  }

  componentDidMount() {
    hotkeys.registerCommand('Cmd:TrashCurrFile', this.trashCurrFile);
  }

  componentWillUnmount() {
    hotkeys.unregisterCommand('Cmd:TrashCurrFile');
  }

  render() {
    const {showingFiles, currFile: {selectIndices}, currSort} = this.props;

    let files = showingFiles;

    return (
      <div
        className="files-layout-list"
        onClick={this.onClick}
      >
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
                className="fname"
                key={file.path}
                file={file}
                index={i}
                selected={selectIndices.indexOf(i) >= 0}
                text={file.name}
                icon={25}
                isFileName={true}
                onClick={this.onItemClick}
                onDoubleClick={this.onItemDoubleClick}
                onContextMenu={this.onItemContextMenu}
                onFileNameChange={this.onFileNameChange}
              />
            )}
          </div>
          <div className="column">
            {files.map((file, i) =>
              <FilePreviewListItem
                className="date"
                key={file.path}
                file={file}
                index={i}
                selected={selectIndices.indexOf(i) >= 0}
                text={`${file.mtime ? format(new Date(file.mtime), 'yyyy-MM-dd HH:mm:ss') : '~'}`}
                onClick={this.onItemClick}
                onDoubleClick={this.onItemDoubleClick}
                onContextMenu={this.onItemContextMenu}
              />
            )}
          </div>
          <div className="column">
            {files.map((file, i) =>
              <FilePreviewListItem
                className="size"
                key={file.path}
                file={file}
                index={i}
                selected={selectIndices.indexOf(i) >= 0}
                text={`${prettyBytes(file.size || 0)}`}
                onClick={this.onItemClick}
                onDoubleClick={this.onItemDoubleClick}
                onContextMenu={this.onItemContextMenu}
              />
            )}
          </div>
        </div>
    </div>
    );
  }
}

export default connectAppControl(FilePreviewListLayout);
