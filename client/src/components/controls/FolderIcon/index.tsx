import React from 'react';
import './index.scss';
import classnames from 'classnames';

export default class FolderIcon extends React.Component<{
  className?: string,
  size: 'large' | 'medium' | 'small',
  color?: string
}> {
  render() {
    const {size, color} = this.props;
    const colorClass = color ? color : 'blue';
    return (
      <div className={classnames(
        "folder-icon",
        colorClass,
        this.props.className,
        size
      )}>
        <div
          className={classnames(
            "top-part",
            colorClass,
          )}
        />
        <div
          className={classnames(
            "body-part",
            colorClass,
          )}
        />
        {this.props.children}
      </div>
      );
  }
}
