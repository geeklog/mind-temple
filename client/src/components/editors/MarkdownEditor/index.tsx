import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown';
import { FileDesc } from '../../../models/file';
import * as remote from '../../../services/fileService';
import './index.scss';
import { blockWheelWithin, decodeHTMLEntities, encodeHTMLEntities } from '../../../utils/domUtils';

interface Props {
  file: FileDesc;
}

interface State {
  text: string;
}

function formatTextForEditor(text: string) {
  text = encodeHTMLEntities(text);
  return text.replace(/\n/g, '<br>');
}

function formatTextForPreview(text: string) {
  text = decodeHTMLEntities(text);
  return text.replace(/<br>/g, '\n');
}

export default class MarkdownEditor extends Component<Props, State> {
  
  container: HTMLDivElement | null = null;
  editor: HTMLDivElement | null = null;

  state = {
    text: ''
  };

  onWheel = blockWheelWithin(() => this.container);

  onChange = (e?: any) => {
    console.log('onChange');
    if (!this.editor) {
      return;
    }
    this.setState({
      text: formatTextForPreview(this.editor.innerHTML)
    });
  }

  async loadText() {
    if (!this.editor) {
      return;
    }
    let text = await remote.text(this.props.file.path);
    if (!this.editor) {
      return;
    }
    this.editor.innerHTML = formatTextForEditor(text);
    this.setState({text});
  }

  componentDidMount() {
    this.loadText();
  }
  
  async componentDidUpdate(prevProps: Props) {
    if (prevProps.file.path === this.props.file.path) {
      return;
    }
    this.loadText();
  }

  render() {
    return (
      <div className="markdown-editor"
        ref={ref => this.container = ref}
        onWheel={this.onWheel}
      >
        <div className="edit-area"
          contentEditable={true}
          ref={ref => this.editor = ref}
          onInput={this.onChange}
        />
        <ReactMarkdown className="preview-area">
          {this.state.text}
        </ReactMarkdown>
      </div>
    )
  }
}
