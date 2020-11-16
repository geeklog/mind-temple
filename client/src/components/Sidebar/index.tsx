import React from 'react';
import './index.scss';
import classnames from 'classnames';

interface Props {
  opened: boolean;
}
export default class Sidebar extends React.PureComponent<Props> {
  render() {
    return (
      <div
        className={classnames(
          "sidebar",
          this.props.opened ? '' : 'hide'
        )}
      >
      </div>
    );
  }
}
