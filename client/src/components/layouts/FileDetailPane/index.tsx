import React from 'react';
import './index.scss';
import classes from 'classnames';
import PlainTextEditor from '../../editors/PlainTextEditor';
import SourceCodeEditor from '../../editors/SourceCodeEditor';
import MarkdownEditor from '../../editors/MarkdownEditor';
import ImageEditor from '../../editors/ImageEditor';
import { AppProps, connectAppControl } from '../../../models/app';
import { resolveExtensionForThumb, isImageExt, isSourceCode } from '../../../utils/extUtils';

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

  render() {
    const { currFile } = this.props;
    const file = currFile.file;
    const thumbExt = resolveExtensionForThumb(file.ext);
    const isDirectory = file.type === 'folder';
    const isImage = !isDirectory && isImageExt(file.ext);
    const isMarkdown = file.type === 'markdown';
    const isCode = isSourceCode(file.ext);
    const isText = !isMarkdown && !isCode && (file.type === 'text' || file.size <= 1024 * 1024 * 2);
    const isFile = !isImage && !isDirectory && !isText && !isMarkdown && !isCode;
    return (
      <div
        className="file-detail-pane"
        onContextMenu={this.onContextMenu}
      >
        {isImage && (
          <div className="thumb">
            <ImageEditor {...this.props} />
          </div>
        )}
        {isMarkdown && <MarkdownEditor {...this.props} />}
        {isCode && <SourceCodeEditor file={file} />}
        {isText && <PlainTextEditor file={file} />}
        {isFile && (
          <div className="thumb">
            <img
              className={classes('preview-img', 'icon')}
              src={`filetypes/${thumbExt}.svg`}
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
