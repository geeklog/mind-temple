import React from 'react';
import FilePreviewGridItem from './FilePreviewGridItem';
import './index.scss';
import { AppProps, connectAppControl } from '../../../models/app';
import { FileDesc } from '../../../models/file';
import hotkeys from '../../../services/hotkeys';
import { LayoutMode } from '../../../models/layout';
import { ContextMenuOptions } from '../type';
import { isClickOnElement } from '../../../utils/domUtils';

class FileGridLayout extends React.PureComponent<AppProps> {
  layout: HTMLDivElement;

  selectAbove() {
    const layout = document.getElementsByClassName('files-layout-grid')[0];
    const {currIndex, setCurrIndex} = this.props;
    const currItem = layout.children[currIndex];
    if (!currItem) {
      return;
    }
    const {x: currX, y: currY} = currItem.getBoundingClientRect();

    // find the closest x, and closest y, also y < currItem.y;
    const siblings = layout.children;
    let dx;
    let ymax;
    let targetIndex;

    for (let i = 0; i < siblings.length; i++) {
      if (i === currIndex) {
        continue;
      }
      const item = siblings[i];
      const {x, y} = item.getBoundingClientRect();
      if (y >= currY) {
        continue;
      }
      if (targetIndex === undefined) {
        targetIndex = i;
        dx = Math.abs(x - currX);
        ymax = y;
        continue;
      }
      if (dx < Math.abs(x - currX)) {
        continue;
      }
      if (ymax > y) {
        continue;
      }
      dx = Math.abs(x - currX);
      ymax = y;
      targetIndex = i;
    }
    if (targetIndex !== undefined) {
      setCurrIndex(targetIndex);
    }
  }

  selectBelow() {
    const layout = this.layout;
    const {currIndex, setCurrIndex} = this.props;
    const currItem = layout.children[currIndex];
    if (!currItem) {
      return;
    }
    const {x: currX, y: currY} = currItem.getBoundingClientRect();

    // find the closest x, and closest y, also y > currItem.y;
    const siblings = layout.children;
    let dx;
    let ymin;
    let targetIndex;

    for (let i = 0; i < siblings.length; i++) {
      if (i === currIndex) {
        continue;
      }
      const item = siblings[i];
      const {x, y} = item.getBoundingClientRect();
      if (y <= currY) {
        continue;
      }
      if (targetIndex === undefined) {
        targetIndex = i;
        dx = Math.abs(x - currX);
        ymin = y;
        continue;
      }
      if (dx < Math.abs(x - currX)) {
        continue;
      }
      if (ymin < y) {
        continue;
      }
      dx = Math.abs(x - currX);
      ymin = y;
      targetIndex = i;
    }
    if (targetIndex !== undefined) {
      setCurrIndex(targetIndex);
    }
  }

  onKeyDown = (event: React.KeyboardEvent) => {
    const {
      prevLayoutMode,
      layoutMode,
      selectPrev,
      selectNext,
      setLayoutMode
    } = this.props;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      selectPrev();
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      selectNext();
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.selectAbove();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.selectBelow();
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

  onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isClickOnElement(event, 'grid-item')) {
      return;
    }
    const {setCurrIndex} = this.props;
    setCurrIndex(null);
  }

  onItemClick = (file: FileDesc, index: number) => {
    const {setCurrIndex, toggleSelectIndex: addSelectIndex} = this.props;
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
    const {setCurrIndex } = this.props;
    const {index} = options;
    setCurrIndex(index);
    this.props.toggleFileContextMenu(options);
  }

  onFileNameChange = (newFileName: string, file: FileDesc, index: number) => {
    this.props.renameFile({
      filePath: file.path,
      newName: newFileName
    });
  }

  trashCurrFile = () => {
    const {trash, selectedFiles} = this.props;
    trash(selectedFiles);
  }

  componentDidMount() {
    hotkeys.registerCommand('Cmd:TrashCurrFile', this.trashCurrFile);
  }

  componentWillUnmount() {
    hotkeys.unregisterCommand('Cmd:TrashCurrFile');
  }

  componentDidUpdate(prevProps: AppProps) {
    if (prevProps.currIndex === this.props.currIndex) {
      return;
    }
    if (!this.layout) {
      return;
    }
    const currItem = this.layout.children[this.props.currIndex] as HTMLDivElement;
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

  render() {
    const {showingFiles, currFile: {selectIndices}, getFileColor} = this.props;
    return (
      <div
        className="files-layout-grid"
        onClick={this.onClick}
        tabIndex={0}
        onKeyDown={this.onKeyDown}
        ref={(ref) => this.layout = ref}
      >
        {showingFiles.map((file, i) =>
          <FilePreviewGridItem
            index={i}
            key={i}
            color={getFileColor(file.path)}
            file={file}
            selected={selectIndices.indexOf(i) >= 0 }
            onClick={this.onItemClick}
            onDoubleClick={this.onItemDoubleClick}
            onContextMenu={this.onItemContextMenu}
            onFileNameChange={this.onFileNameChange}
          />
        )}
      </div>
    );
  }
}

export default connectAppControl(FileGridLayout);
