import React from 'react';
import { FileDesc } from '../../../models/file';
import GallerySubGridItem from './GallerySubGridItem';
import { AppProps, connectAppControl } from '../../../models/app';
import { blockWheelWithin } from '../../../utils/domUtils';
import FolderIcon from '../../controls/FolderIcon/index';

interface Props extends AppProps {
  file: FileDesc;
}

class GalleryFolderItem extends React.PureComponent<Props> {

  div: HTMLDivElement | null = null;

  onWheel = blockWheelWithin(() => this.div);

  onFolderSubGridItemClick = (index: number) => {
    const {file, updateFolder} = this.props;
    updateFolder({
      path: file.path,
      currIndex: index
    });
  }

  render() {
    const {file} = this.props;
    const subCurrIndex = this.props.getFolder(file.path)?.currIndex ?? 0;
    return (
      <FolderIcon
        className="folder"
        size="large"
      >
        {file.subs?.map((subFile, i) =>
          <GallerySubGridItem
            index={i}
            key={i}
            file={subFile}
            selected={i === subCurrIndex}
            onClick={this.onFolderSubGridItemClick}
          />
        )}
      </FolderIcon>
    );
  }
}

export default connectAppControl(GalleryFolderItem);
