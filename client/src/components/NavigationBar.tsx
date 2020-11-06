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
  editMode: boolean;
}

export default class NavigationBar extends React.Component<Props, State> {

  state = {
    longestPath : '',
    editMode: false
  };

  input: HTMLInputElement | null = null;

  componentDidUpdate() {
    if (!this.state.longestPath.startsWith(this.props.path)) {
      this.setState({
        longestPath: this.props.path
      });
    }
  }

  componentDidMount() {
    if (!this.state.longestPath || this.state.longestPath.length < this.props.path.length) {
      this.setState({
        longestPath: this.props.path
      });
    }
  }
  
  onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.control.setFolderPath(event.target.value);
  };

  onInputBlur = () => {
    this.setState({editMode: false});
  }

  onBarClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    this.setState({editMode: true});
  }

  onPathClick = (index: number) => {
    let {longestPath} = this.state;
    longestPath = explode(longestPath, '/').slice(0, index + 1).join('');
    this.props.control.setFolderPath(longestPath)
  }

  render() {
    const {path} = this.props;
    let { longestPath, editMode } = this.state;

    if (longestPath.length < path.length) {
      longestPath = path;
    }
    const longestParts = explode(longestPath, '/');
    const parts = explode(path, '/');

    return (
      <div
        className="address-bar"
        onClick={this.onBarClick}
      >
        {editMode && <input
          type="text"
          ref={(ref) => {
            this.input = ref;
            ref?.focus();
          }}
          value={path}
          onChange={this.onInputChange}
          onBlur={this.onInputBlur}
        />}
        {!editMode && <div className="address-bar-content">
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
        </div>}
      </div>
    )
  }
}
