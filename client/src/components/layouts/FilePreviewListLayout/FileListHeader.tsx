import React from 'react';
import './index.scss';
import Label from '../../controls/Label';
import ToggleButton from '../../controls/ToggleButton';

export default class Header extends React.PureComponent<{
  name: string,
  asc: string,
  onSort: (asc: string) => void
}> {

  state = {asc: false};

  onToggle = (b: boolean) => {
    this.setState({asc: b});
    this.props.onSort(b ? 'asc' : 'desc');
  }

  render() {
    const {name, asc} = this.props;
    return (
      <div className="header">
        <Label
          text={name}
        />
        <ToggleButton
          btns={['chevron-down', 'chevron-up']}
          on={(asc !== undefined) ? (asc === 'asc') : (this.state.asc)}
          onToggle={this.onToggle}
        />
      </div>
    );
  }
}
