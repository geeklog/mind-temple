import React from 'react'
import { explode } from 'mikov/str';
import PathIndicator from './PathIndicator';
import './index.scss'
import classnames from 'classnames';
import { AppProps, connectAppControl } from '../../models/app';

interface State {
  longestPath: string;
  editMode: boolean;
}

class NavigationBar extends React.Component<AppProps, State> {

  state = {
    longestPath : '',
    editMode: false
  };

  input: HTMLInputElement | null = null;
  pathView: HTMLDivElement | null = null;

  componentDidMount() {
    if (!this.state.longestPath || this.state.longestPath.length < this.props.currPath.length) {
      this.setState({
        longestPath: this.props.currPath
      });
    }
  }

  componentDidUpdate() {
    if (!this.state.longestPath.startsWith(this.props.currPath)) {
      this.setState({
        longestPath: this.props.currPath
      });
    }
    this.pathView!.addEventListener('wheel', this.onWheel, {passive: false});
  }
  
  onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.setCurrPath(event.target.value);
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
    this.props.setCurrPath(longestPath)
  }

  onWheel = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    this.pathView?.scrollBy(event.deltaY, 0);
  }

  render() {
    const {currPath} = this.props;
    let { longestPath, editMode } = this.state;

    if (longestPath.length < currPath.length) {
      longestPath = currPath;
    }
    const longestParts = explode(longestPath, '/');
    const parts = explode(currPath, '/');

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
          value={currPath}
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

export default connectAppControl(NavigationBar);