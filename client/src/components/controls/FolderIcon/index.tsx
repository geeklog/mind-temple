import React from 'react';
import './index.scss';
import classnames from 'classnames';

export default class FolderIcon extends React.Component<{
  className?: string,
  size: 'large' | 'medium' | 'small'
}> {
  render() {
    const {size} = this.props;
    return (
      <div className={classnames(
        "folder-icon",
        this.props.className,
        size
      )}>
        <div className={classnames("top-part")} />
        <div className={classnames("body-part")} />
        {this.props.children}
      </div>
      );
  }
}
