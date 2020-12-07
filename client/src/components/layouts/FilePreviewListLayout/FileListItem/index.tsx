import React, { PureComponent } from 'react';
import Thumb from '../../Thumb';
import { FileItemProps } from '../../type';
import Label from '../../../controls/Label/index';
import FileNameLabel from '../../FileNameLabel';
import { FileDesc } from '../../../../models/file';
import FileItem from '../../FileItem';
import './index.scss';

interface Props extends FileItemProps {
  icon?: number;
  text: string;
  isFileName?: boolean;
  onFileNameChange?: (newFileName: string, file: FileDesc, index: number) => void;
}

export default class FileListItem extends PureComponent<Props> {

  onFileNameChange = (newFileName: string) => {
    const { file, index }: Props = this.props;
    if (file.name === newFileName) {
      return;
    }
    this.props.onFileNameChange(newFileName, file, index);
  }

  render() {
    const {color, file, selected, icon, text, isFileName} = this.props;

    return (
      <FileItem
        {...this.props}
      >
        {icon &&
          <Thumb
            type="list"
            size={icon}
            selected={selected}
            file={file}
            color={color}
          />
        }
        {
          isFileName
            ? <FileNameLabel
                name={file.name}
                onChange={this.onFileNameChange}
              />
            : <Label text={text} />
        }
      </FileItem>
    );
  }
}
