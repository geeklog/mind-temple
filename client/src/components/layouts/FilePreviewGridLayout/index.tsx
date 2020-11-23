import React from 'react';
import FilePreviewGridItem from './FilePreviewGridItem';
import './index.scss';
import { AppProps, connectAppControl } from '../../../models/app';
import { FileDesc } from '../../../models/file';
import hotkeys from '../../../services/hotkeys';

class FilePreviewGridLayout extends React.PureComponent<AppProps> {

  onItemClick = (file: FileDesc, index: number) => {
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

  onItemContextMenu = (options: {
    visible: boolean; x: number; y: number; index: number; file: FileDesc;
  }) => {
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

  render() {
    const {showingFiles, currFile: {selectIndices}} = this.props;
    return (
      <div className="files-layout-grid">
        {showingFiles.map((file, i) =>
          <FilePreviewGridItem
            index={i}
            key={i}
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

export default connectAppControl(FilePreviewGridLayout);
