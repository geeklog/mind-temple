import React, { Component } from 'react';
import { FileDesc } from '../../../models/file';
import * as remote from '../../../services/fileService';
import './index.scss';

interface Props {
  file: FileDesc;
}

interface State {
  text: string;
}

export default class PlainTextEditor extends Component<Props, State> {

  state = {
    text: ''
  };

  async componentDidMount() {
    console.log('PlainTextEditor.componentDidMount');
    const text = await remote.text(this.props.file.path);
    this.setState({text});
  }

  async componentDidUpdate(prevProps: Props) {
    if (prevProps.file.path === this.props.file.path) {
      return;
    }
    console.log('PlainTextEditor.componentDidUpdate');
    const text = await remote.text(this.props.file.path);
    this.setState({text});
  }

  render() {
    return (
      <div className="plain-text-editor" contentEditable="true">
        {this.state.text}
      </div>
    );
  }
}
