import React, { PureComponent } from 'react';
import classnames from 'classnames';
import './index.scss';
import eventCenter from '../../../services/eventCenter';
import { fname } from '../../../utils/pathUtils';

interface Props {
  name: string;
  onChange: (newFileName: string) => void;
}

interface State {
  editing: boolean;
}

export default class FileNameLabel extends PureComponent<Props, State> {

  div: HTMLDivElement;
  state = {
    editing: false
  };

  onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (this.state.editing) {
      return;
    }
    this.setState({
      editing: true
    });
    setTimeout(() => {
      this.div.focus();
      const range = document.createRange();
      range.selectNodeContents(this.div);
      range.collapse(false);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }, 0);
  }

  onBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const {onChange} = this.props;
    this.setState({
      editing: false
    });
    onChange(this.div.innerText);
  }

  onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const {onChange} = this.props;
    if (event.key === 'Enter') {
      event.preventDefault();
      this.setState({
        editing: false
      });
      onChange(this.div.innerText);
    }
    event.stopPropagation();
  }

  onClickOutter: any = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === this.div) {
      return;
    }
    if (!this.state.editing) {
      return;
    }
    this.setState({
      editing: false
    });
  }

  onEventRenameFile = (event: string, newFilePath: string) => {
    if (fname(newFilePath) === this.props.name) {
      this.setState({
        editing: true
      });
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
