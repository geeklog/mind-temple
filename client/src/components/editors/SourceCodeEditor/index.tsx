import React, { Component } from 'react';
import { FileDesc } from '../../../models/file';
import * as remote from '../../../services/fileService';
import * as monaco from 'monaco-editor';
import './index.scss';
import { languageType } from '../../../utils/extUtils';

monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: true,
});

interface Props {
  file: FileDesc;
}

interface State {
  code: string;
}

export default class SourceCodeEditor extends Component<Props, State> {
  div: HTMLDivElement;
  editor: monaco.editor.IStandaloneCodeEditor;

  onResize = () => {
    this.editor.layout();
  }

  async componentDidMount() {
    const {file} = this.props;
    const code = await remote.text(file.path);
    if (this.div) {
      this.editor = monaco.editor.create(this.div, {
        value: code,
        language: languageType(file.ext),
        lineHeight: 20,
        fontFamily: 'Ubuntu Mono',
        fontSize: 18,
        theme: 'vs-light',
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
      });
    }
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    this.editor?.dispose();
    window.removeEventListener('resize', this.onResize);
  }

  async componentDidUpdate(prevProps: Props) {
    if (prevProps.file.path === this.props.file.path) {
      return;
    }
    const code = await remote.text(this.props.file.path);
    this.setState({ code });
  }

  render() {
    return (
      <div
        className="source-code-editor"
        ref={(ref) => this.div = ref}
      />
    );
  }
}
