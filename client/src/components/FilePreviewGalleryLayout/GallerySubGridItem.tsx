import React from 'react';
import classnames from 'classnames';
import { FileDesc, ImageDesc } from '../../models/file';
import * as service from '../../services/fileService';
import Icon from '../Icon';
import { AppProps, connectAppControl } from '../../models/app';

interface Props extends AppProps {
  index: number;
  file: FileDesc;
  selected: boolean;
  onClick: (index: number) => void;
}

class GallerySubGridItem extends React.PureComponent<Props> {

  onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.props.onClick(this.props.index);
  }

  onDoubleClick = () => {
    const { file, open } = this.props;
    open(file);
  }

  onContextMenu = (event: any) => {
    const {file, toggleFileContextMenu} = this.props;
    event.preventDefault();
    event.stopPropagation();
    const x = event.pageX;
    const y = event.pageY;
    this.props.onClick(this.props.index);
    toggleFileContextMenu({visible: true, x, y, file});
  }

  render() {
    const {file, selected} = this.props;
    let size = 40;
    let ext = service.resolveExtension(file.ext)
    let isDirectory = file.type === 'folder';
    let isImage = !isDirectory && service.isImage(ext);
    let isFile = !isImage && !isDirectory;
    const src = isImage
      ? service.thumb(file, {h:size})
      : `filetypes/${ext}.svg`;

    const img = file as ImageDesc;

    const style = isImage ? (
      img.width > img.height
        ? { width: `${size}px`}
        : { height: `${size}px`}
    ) : {
      width: `${size}px`,
      height: `${size}px`
    };

    return (
      <div
        className={classnames('grid-item', selected? 'selected' : '')}
        key={file.path}
        onClick={this.onClick}
        onDoubleClick={this.onDoubleClick}
        onContextMenu={this.onContextMenu}
      >
        {isDirectory &&
          <Icon
            name="folder"
            className="svg-icon"
          />
        }
        {isImage &&
          <img
            className="preview-img"
            src={src}
            alt={file.name}
            style={style}
          />
        }
        {isFile &&
          <img
            className="svg-filetype-icon"
            src={src}
            alt={file.name}
            style={style}
          />
        }
        <div className="file-name">
          {file.name}
        </div>
      </div>
    );
  }
}

export default connectAppControl(GallerySubGridItem);
