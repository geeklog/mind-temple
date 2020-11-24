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
    return (
      <div
        className="file-detail-pane"
        onContextMenu={this.onContextMenu}
      >
        {this.renderFileDetail()}
      </div>
    );
  }

  renderFileDetail() {
    const { currFile } = this.props;
    const file = currFile.file;
    const thumbExt = resolveExtensionForThumb(file.ext);
    const isFolder = file.type === 'folder';
    const isImage = !isFolder && isImageExt(file.ext);
    const isMarkdown = file.type === 'markdown';
    const isCode = isSourceCode(file.ext);
    const isText = (file.type === 'text' || file.size <= 1024 * 1024 * 2);

    if (isImage) {
      return (
        <div className="thumb">
          <ImageEditor {...this.props} />
        </div>
      );
    }
    if (isMarkdown) {
      return <MarkdownEditor {...this.props} />;
    }
    if (isCode) {
      return <SourceCodeEditor file={file} />;
    }
    if (isText) {
      return <PlainTextEditor file={file} />;
    }
    return (
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
    );
  }
}

export default connectAppControl(FileDetailPane);
