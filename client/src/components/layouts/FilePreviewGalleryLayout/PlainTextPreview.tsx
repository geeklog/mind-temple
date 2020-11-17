import React, { Component } from 'react';
import { FileDesc } from '../../../models/file';
import * as remote from '../../../services/fileService';
import './index.scss';
import { formatTextForEditor } from '../../../utils/markdownUtils';

interface Props {
  file: FileDesc;
}

interface State {
  text: string;
}

export default class PlainTextPreview extends Component<Props, State> {

  editor: HTMLDivElement;

  async componentDidMount() {
    console.log('PlainTextEditor.componentDidMount');
    let text = await remote.text(this.props.file.path);
    text = formatTextForEditor(text.slice(0, 1000));
    this.editor.innerHTML = text;
  }

  async componentDidUpdate(prevProps: Props) {
    if (prevProps.file.path === this.props.file.path) {
      return;
    }
    console.log('PlainTextEditor.componentDidUpdate');
    let text = await remote.text(this.props.file.path);
    text = formatTextForEditor(text.slice(0, 1000));
    this.editor.innerHTML = text;
  }

  render() {
    return (
      <div
        className="plain-text-preview"
        ref={ref => this.editor = ref}
      />
    );
  }
}
