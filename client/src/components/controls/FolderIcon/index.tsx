import React from 'react';
import './index.scss';
import classnames from 'classnames';

export default class FolderIcon extends React.Component<{size: 'medium' | 'small'}> {
  render() {
    const {size} = this.props;
    return (
      <div className={classnames("folder-icon", size)}>
        <div className={classnames("top-part")} />
        <div className={classnames("body-part")} />
      </div>
      );
  }
}
