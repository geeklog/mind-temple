import React, { Component } from 'react';
import { FileDesc } from '../../../models/file';
import * as remote from '../../../services/fileService';
import LazyDiv from '../../controls/LazyDiv';
import './index.scss';

interface Props {
  file: FileDesc;
}

interface State {
  text: string;
}

export default class PlainTextEditor extends Component<Props, State> {
  editor: LazyDiv;
  state = {
    text: ''
  };

  async componentDidMount() {
    let text = await remote.text(this.props.file.path);
    text = text.replace(/\n/g, '<br>');
    this.editor.setContent(text);
  }

  async componentDidUpdate(prevProps: Props) {
    if (prevProps.file.path === this.props.file.path) {
      return;
    }
    const text = await remote.text(this.props.file.path);
    this.setState({ text });
  }

  render() {
    return (
      <LazyDiv
        className="plain-text-editor"
        ref={(ref) => (this.editor = ref)}
      />
    );
  }
}
