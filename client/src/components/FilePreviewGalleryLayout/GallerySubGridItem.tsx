import React from 'react';
import classnames from 'classnames';
import { AppControl } from '../../App';
import { FileDesc, ImageDesc } from '../../models/file';
import * as service from '../../services/fileService';
import Icon from '../Icon';

interface Props {
  index: number;
  file: FileDesc;
  selected: boolean;
  control: AppControl;
}

export default class GallerySubGridItem extends React.PureComponent<Props> {

  onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const {index} = this.props;
    this.props.control.setCurrIndex(index);
  }

  onDoubleClick = () => {
    const { file }: Props = this.props;
    this.props.control.open(file);
  }

  onContextMenu = (event: any) => {
    const {file, control} = this.props;
    event.preventDefault();
    event.stopPropagation();
    const x = event.pageX;
    const y = event.pageY;
    control.toggleFileContextMenu(true, x, y, file);
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
            alt=""
            style={style}
          />
        }
        {isFile &&
          <img
            className="svg-filetype-icon"
            src={src}
            alt=""
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
