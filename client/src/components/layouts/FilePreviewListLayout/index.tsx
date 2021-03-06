import React from 'react';
import './index.scss';
import FileListItem from './FileListItem';
import { AppProps, connectAppControl } from '../../../models/app';
import prettyBytes from 'pretty-bytes';
import { FileDesc } from '../../../models/file';
import { format } from 'date-fns';
import hotkeys from '../../../services/hotkeys';
import { ContextMenuOptions } from '../type';
import { isClickOnElement } from '../../../utils/domUtils';
import Header from './FileListHeader';
import DraggingItems from './DraggingItems';
import { LayoutMode } from '../../../models/layout';
import { dirname } from '../../../utils/pathUtils';
import classnames from 'classnames';

interface State {
  dragging: boolean;
  droppingIndex?: number;
}

class FileListLayout extends React.PureComponent<AppProps, State> {

  layout: HTMLDivElement;
  state = {
    dragging: false,
    droppingIndex: undefined
  };

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

  onKeyDown = (event: React.KeyboardEvent) => {
    const {
      prevLayoutMode,
      layoutMode,
      selectPrev,
      selectNext,
      setLayoutMode,
      selectedFiles,
      currFile,
      navigateTo,
      open
    } = this.props;

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      selectPrev();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      selectNext();
      return;
    }
    if (event.key === 'Enter' && selectedFiles.length === 1 && selectedFiles[0].type === 'folder') {
      event.preventDefault();
      open(selectedFiles[0]);
      return;
    }
    if (event.key === 'Backspace' && !event.metaKey) {
      event.preventDefault();
      navigateTo(dirname(currFile.path));
      return;
    }
    if (event.key === ' ') {
      event.preventDefault();
      if (layoutMode !== 'gallery') {
        setLayoutMode('gallery');
      } else {
        setLayoutMode(prevLayoutMode as LayoutMode);
      }
    }
  }

  onItemClick =  (file: FileDesc, index: number) => {
    const {currIndex, setCurrIndex, toggleSelectIndex: addSelectIndex, selectIndicesBetween} = this.props;
    if (hotkeys.metaHolding) {
      addSelectIndex(index);
    } else if (hotkeys.shiftHolding) {
      selectIndicesBetween(currIndex, index);
    } else {
      setCurrIndex(index);
    }
  }

  onItemDoubleClick =  (file: FileDesc, index: number) => {
    this.props.open(file);
  }

  onItemContextMenu = (options: ContextMenuOptions) => {
    const {setCurrIndex, selectedFiles } = this.props;
    const {index} = options;
    if (selectedFiles.length <= 1) {
      setCurrIndex(index);
    }
    this.props.toggleFileContextMenu(options);
  }

  onItemDragStart = (file: FileDesc, index: number, event: React.DragEvent<HTMLLIElement>) => {
    // console.log('onItemDragStart', file, index);
    this.setState({dragging: true});
    const img = document.getElementById('dragging-items').cloneNode(true) as HTMLSpanElement;
    document.body.appendChild(img);
    event.dataTransfer.setDragImage(img, 20, 20);
  }

  onItemDragEnter = (file: FileDesc, index: number, event: React.DragEvent<HTMLLIElement>) => {
    // console.log('onItemDragEnter', file, index);
    this.setState({droppingIndex: index});
  }

  onItemDragLeave = (file: FileDesc, index: number, event: React.DragEvent<HTMLLIElement>) => {
    // console.log('onItemDragLeave', file, index);
  }

  onItemDragOver = (file: FileDesc, index: number, event: React.DragEvent<HTMLLIElement>) => {
    // console.log('onItemDragOver', file, index);
  }

  onItemDragEnd = (file: FileDesc, index: number, event: React.DragEvent<HTMLLIElement>) => {
    // console.log('onItemDragEnd', file, index);
    this.setState({
      dragging: false,
      droppingIndex: undefined
    });
  }

  onItemDrop = (targetFile: FileDesc, index: number) => {
    const {moveFiles, selectedFiles} = this.props;
    this.setState({
      dragging: false,
      droppingIndex: undefined
    });
    if (~selectedFiles.indexOf(targetFile)) {
      return;
    }
    if (targetFile.type !== 'folder') {
      return;
    }
    moveFiles({files: selectedFiles, targetPath: targetFile.path});
  }

  onSortByName = (order: string) => {
    this.props.sortCurrFolder('name', order);
  }

  onSortByTime = (order: string) => {
    this.props.sortCurrFolder('time', order);
  }

  onSortBySize = (order: string) => {
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

  componentDidUpdate(prevProps: AppProps) {
    if (prevProps.currPath !== this.props.currPath) {
      this.props.setCurrIndex(null);
      return;
    }
    if (prevProps.currIndex === this.props.currIndex) {
      return;
    }
    if (!this.layout) {
      return;
    }
    const currItem = this.layout.children[0].children[this.props.currIndex] as HTMLDivElement;
    if (!currItem) {
      return;
    }

    // scroll to make sure item stay inside screen

    const elRect = currItem.getBoundingClientRect();
    const {top} = elRect; // y position relative to window
    const h = elRect.height;
    if (top < 0) {
      this.layout.scrollTop = currItem.offsetTop;
    } else if (top + h > window.innerHeight) {
      this.layout.scrollTop = currItem.offsetTop + currItem.offsetHeight - this.layout.clientHeight;
    }
  }

  componentWillUnmount() {
    hotkeys.unregisterCommand('Cmd:TrashCurrFile');
  }

  render() {
    const {selectedFiles, currSort} = this.props;
    return (
      <div
        className="files-layout-list"
        tabIndex={0}
        onClick={this.onClick}
        onKeyDown={this.onKeyDown}
      >
        <DraggingItems items={selectedFiles} />
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
        <div
          className="contents"
          ref={(ref) => this.layout = ref}
        >
          {this.renderColumn('fname')}
          {this.renderColumn('size')}
          {this.renderColumn('date')}
        </div>
    </div>
    );
  }

  renderColumn(columnType: string) {
    const {showingFiles, currFile: {selectIndices}, getFileColor} = this.props;
    const {dragging, droppingIndex} = this.state;
    let files = showingFiles;
    const className = ({fname: 'fname', size: 'size', date: 'date'})[columnType];
    let label: any;
    if (columnType === 'fname') {
      label = (file: FileDesc) => file.name;
    } else if (columnType === 'size') {
      label = (file: FileDesc) => `${prettyBytes(file.size || 0)}`;
    } else if (columnType === 'date') {
      label = (file: FileDesc) => `${file.mtime ? format(new Date(file.mtime), 'yyyy-MM-dd HH:mm:ss') : '~'}`;
    }

    return (
      <div className="column">
        {files.map((file, i) =>
          <FileListItem
            className={classnames('cell', className)}
            key={file.path}
            color={getFileColor(file.path)}
            file={file}
            index={i}
            selected={selectIndices.indexOf(i) >= 0}
            dragging={dragging && selectIndices.indexOf(i) >= 0}
            dropping={dragging && droppingIndex === i}
            text={label(file)}
            icon={columnType === 'fname' ? 25 : undefined}
            isFileName={columnType === 'fname'}
            onClick={this.onItemClick}
            onDoubleClick={this.onItemDoubleClick}
            onContextMenu={this.onItemContextMenu}
            onDragStart={this.onItemDragStart}
            onDragEnd={this.onItemDragEnd}
            onDrop={this.onItemDrop}
            onDragOver={this.onItemDragOver}
            onDragEnter={this.onItemDragEnter}
            onDragLeave={this.onItemDragLeave}
            onFileNameChange={this.onFileNameChange}
          />
        )}
      </div>
    );
  }
}

export default connectAppControl(FileListLayout);
