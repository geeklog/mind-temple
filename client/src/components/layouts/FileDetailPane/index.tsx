import React from 'react';
import './index.scss';
import * as service from '../../../services/fileService';
import classes from 'classnames';
import PlainTextEditor from '../../editors/PlainTextEditor';
import MarkdownEditor from '../../editors/MarkdownEditor';
import ImageEditor from '../../editors/ImageEditor';
import { AppProps, connectAppControl } from '../../../models/app';

class FileDetailPane extends React.PureComponent<AppProps> {

  onContextMenu = (event: any) => {
    const { files, currIndex, toggleFileContextMenu } = this.props;
    const file = files[currIndex];
    event.preventDefault();
    event.stopPropagation();
    const x = event.pageX;
    const y = event.pageY;
    toggleFileContextMenu({ visible: true, x, y, file });
  }

  onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    // const { selectNext, selectPrev } = this.props;
    // if (event.deltaY > 0) {
    //   selectNext();
    // } else if (event.deltaY < 0) {
    //   selectPrev();
    // }
  }

  render() {
    const { currFile } = this.props;
    const file = currFile.file;
    const ext = service.resolveExtension(file.ext);
    const isDirectory = file.type === 'folder';
    const isImage = !isDirectory && service.isImage(ext);
    const isMarkdown = file.type === 'markdown';
    const isText = file.type === 'text';
    const isFile = !isImage && !isDirectory && !isText && !isMarkdown;

    return (
      <div
        className="file-detail-pane"
        onContextMenu={this.onContextMenu}
        onWheel={this.onWheel}
      >
        {isImage && (
          <div className="thumb">
            <ImageEditor {...this.props} />
          </div>
        )}
        {isMarkdown && <MarkdownEditor {...this.props} />}
        {isText && <PlainTextEditor file={file} />}
        {isFile && (
          <div className="thumb">
            <img
              className={classes('preview-img', 'icon')}
              src={`filetypes/${ext}.svg`}
              style={{
                height: `calc(65vh - 100px)`,
                maxWidth: `calc(100vw - 200px)`,
                maxHeight: `calc(100vh - 100px)`
              }}
              alt={file.name}
            />
            <div className="file-name">{file.name}</div>
          </div>
        )}
      </div>
    );
  }
}

export default connectAppControl(FileDetailPane);
