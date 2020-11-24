import React, { Component } from 'react';
import * as remote from '../../../services/fileService';
import * as monaco from 'monaco-editor';
import './index.scss';
import { languageType } from '../../../utils/extUtils';
import { AppProps } from '../../../models/app';

monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: true,
});

interface State {
  code: string;
}

export default class SourceCodeEditor extends Component<AppProps, State> {
  div: HTMLDivElement;
  editor: monaco.editor.IStandaloneCodeEditor;

  onResize = () => {
    this.editor.layout();
  }

  async componentDidMount() {
    const {currFile, theme} = this.props;
    const code = await remote.text(currFile.file.path);
    if (this.div) {
      this.editor = monaco.editor.create(this.div, {
        value: code,
        language: languageType(currFile.file.ext),
        lineHeight: 20,
        fontFamily: 'Ubuntu Mono',
        fontSize: 18,
        theme: 'vs-' + theme,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
      });
    }
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    this.editor?.dispose();
    window.removeEventListener('resize', this.onResize);
  }

  async componentDidUpdate(prevProps: AppProps) {
    if (prevProps.currFile.path === this.props.currFile.path) {
      return;
    }
    const {theme} = this.props;
    monaco.editor.setTheme('vs-' + theme);
  }

  render() {
    return (
      <div
        className="source-code-editor"
      >
        <div
          className="editor"
          ref={(ref) => this.div = ref}
        />
      </div>
    );
  }
}
