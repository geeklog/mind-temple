import React from 'react'
import { AppControl } from '../../App';
import { explode } from 'mikov/str';
import PathIndicator from '../PathIndicator';
import './index.scss'
import classnames from 'classnames';

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
  pathView: HTMLDivElement | null = null;

  componentDidMount() {
    if (!this.state.longestPath || this.state.longestPath.length < this.props.path.length) {
      this.setState({
        longestPath: this.props.path
      });
    }
  }

  componentDidUpdate() {
    if (!this.state.longestPath.startsWith(this.props.path)) {
      this.setState({
        longestPath: this.props.path
      });
    }
    this.pathView!.addEventListener('wheel', this.onWheel, {passive: false});
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

  onWheel = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    this.pathView?.scrollBy(event.deltaY, 0);
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
        className="navigation-bar"
        onClick={this.onBarClick}
      >
        <input
          className={classnames(editMode ? '' : 'hide')}
          type="text"
          ref={(ref) => {
            this.input = ref;
            ref?.focus();
          }}
          value={path}
          onChange={this.onInputChange}
          onBlur={this.onInputBlur}
        />
        <div
          className={classnames('content', editMode ? 'hide' : '')}
          ref={(ref) => this.pathView = ref}
        >
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
