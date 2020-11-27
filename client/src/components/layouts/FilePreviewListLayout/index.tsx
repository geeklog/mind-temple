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

interface State {
  dragging: boolean;
  droppingIndex?: number;
}

class FileListLayout extends React.PureComponent<AppProps, State> {

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

  onItemClick =  (file: FileDesc, index: number) => {
    const {setCurrIndex, addSelectIndex} = this.props;
    if (hotkeys.metaHolding) {
      addSelectIndex(index);
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

  onItemDrop = (file: FileDesc, index: number) => {
    const {moveFiles, selectedFiles} = this.props;
    console.log('onItemDrop', file, index);
    this.setState({
      dragging: false,
      droppingIndex: undefined
    });
    moveFiles({files: selectedFiles, targetPath: file.path});
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
    this.props.setCurrIndex(null);
  }

  componentWillUnmount() {
    hotkeys.unregisterCommand('Cmd:TrashCurrFile');
  }

  render() {
    const {selectedFiles, currSort} = this.props;
    return (
      <div
        className="files-layout-list"
        onClick={this.onClick}
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
        <div className="contents">
          {this.renderColumn('fname')}
          {this.renderColumn('size')}
          {this.renderColumn('date')}
        </div>
    </div>
    );
  }

  renderColumn(columnType: string) {
    const {showingFiles, currFile: {selectIndices}} = this.props;
    const {dragging, droppingIndex} = this.state;
    let files = showingFiles;
    const className = ({fname: 'fname', size: 'size', date: 'date'})[columnType];
    let textGen: any;
    if (columnType === 'fname') {
      textGen = (file: FileDesc) => file.name;
    } else if (columnType === 'size') {
      textGen = (file: FileDesc) => `${prettyBytes(file.size || 0)}`;
    } else if (columnType === 'date') {
      textGen = (file: FileDesc) => `${file.mtime ? format(new Date(file.mtime), 'yyyy-MM-dd HH:mm:ss') : '~'}`;
    }

    return (
      <div className="column">
        {files.map((file, i) =>
          <FileListItem
            className={className}
            key={file.path}
            file={file}
            index={i}
            selected={selectIndices.indexOf(i) >= 0}
            dragging={dragging && selectIndices.indexOf(i) >= 0}
            dropping={dragging && droppingIndex === i}
            text={textGen(file)}
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
