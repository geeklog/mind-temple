import React, { PureComponent } from 'react';
import classnames from 'classnames';
import './index.scss';
import eventCenter from '../../../services/eventCenter';
import { fname } from '../../../utils/pathUtils';
import { moveCaretToEnd } from '../../../utils/domUtils';

interface Props {
  name: string;
  onChange: (newFileName: string) => void;
}

interface State {
  editing: boolean;
  activate: number;
}

export default class FileNameLabel extends PureComponent<Props, State> {

  div: HTMLDivElement;
  state = {
    editing: false,
    activate: 0,
  };

  onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const {editing, activate} = this.state;

    if (editing) {
      return;
    }

    // First click activate the label,
    // Second click let it into editing mode.
    // Use a 0.5s interval to avoid conflict with double click event
    if (!activate || Date.now() - activate < 600) {
      this.setState({
        activate: Date.now()
      });
      return;
    }

    this.setState({
      editing: true
    });
    setTimeout(() => {
      this.div.focus();
      moveCaretToEnd(this.div);
    }, 0);
  }

  onBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const {onChange} = this.props;
    this.setState({
      editing: false,
      activate: 0
    });
    onChange(this.div.innerText);
  }

  onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const {onChange} = this.props;
    if (event.key === 'Enter') {
      event.preventDefault();
      this.setState({
        editing: false,
        activate: 0
      });
      onChange(this.div.innerText);
    }
    event.stopPropagation();
  }

  onClickOutter: any = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === this.div) {
      return;
    }
    if (!this.state.editing && !this.state.activate) {
      return;
    }
    this.setState({
      editing: false,
      activate: 0
    });
  }

  onEventRenameFile = (event: string, newFilePath: string) => {
    if (fname(newFilePath) === this.props.name) {
      this.setState({
        editing: true
      });
      setTimeout(() => {
        this.div.focus();
        moveCaretToEnd(this.div);
      }, 0);
    }
  }

  componentDidMount() {
    const {name} = this.props;
    this.div.innerText = name;
    document.addEventListener('click', this.onClickOutter);
    eventCenter.listenTo('Cmd:RenameFile', this.onEventRenameFile);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.name !== this.props.name) {
      return;
    }
    this.div.innerText = this.props.name;
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickOutter);
    eventCenter.deafTo('Cmd:RenameFile', this.onEventRenameFile);
  }

  render() {
    const {editing} = this.state;
    return (
      <div
        className={classnames(
          "file-name",
          editing ? 'editing' : ''
        )}
        ref={ref => this.div = ref}
        onClick={this.onClick}
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
        contentEditable={editing}
      />
    );
  }
}
