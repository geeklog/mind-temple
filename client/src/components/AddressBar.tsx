import React from 'react'
import { AppControl } from '../App';
import { explode } from 'mikov/str';
import PathIndicator from './PathIndicator';

interface Props {
  path: string;
  control: AppControl
}

interface State {
  longestPath: string;
}

export default class AddressBar extends React.Component<Props, State> {

  state = {
    longestPath : ''
  };

  componentDidMount() {
    if (!this.state.longestPath || this.state.longestPath.length < this.props.path.length) {
      console.log('setLongestPath:', this.props.path);
      this.setState({
        longestPath: this.props.path
      });
    }
  }
  
  onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.control.setFolderPath(event.target.value);
  };

  onPathClick = (index: number) => {
    let {longestPath} = this.state;
    longestPath = explode(longestPath, '/').slice(0, index + 1).join('');
    this.props.control.setFolderPath(longestPath)
  }

  render() {
    const {path} = this.props;
    let { longestPath } = this.state;
    if (longestPath.length < path.length) {
      longestPath = path;
    }
    const longestParts = explode(longestPath, '/');
    const parts = explode(path, '/');

    return (
      <div className="address-bar">
        <input
          type="text"
          value={path}
          onChange={this.onInputChange}
        />
        <div className="address-bar-content">
          {longestParts.map((p, i) => {
            if (p === '/') {
              return <PathIndicator solid={false} key={i} index={i} path={'/'}/>
            }
            if (parts[i]) {
              return <PathIndicator solid={true} key={i} index={i} path={p} onClick={this.onPathClick}/>
            } else {
              return <PathIndicator solid={false} key={i} index={i} path={p} onClick={this.onPathClick}/>
            }
          })}
        </div>
      </div>
    )
  }
}
