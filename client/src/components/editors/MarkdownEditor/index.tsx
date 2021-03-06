import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import * as remote from '../../../services/fileService';
import './index.scss';
import classnames from 'classnames';
import {atomDark as codeTheme} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {InlineMath, BlockMath} from 'react-katex';
import 'katex/dist/katex.min.css';
import math from 'remark-math';
import { AppProps } from '../../../models/app';
import { formatTextForPreview } from '../../../utils/markdownUtils';

export default class MarkdownEditor extends Component<AppProps> {

  container: HTMLDivElement | null = null;
  editor: HTMLDivElement | null = null;

  onEditKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // event.stopPropagation();
  }

  onEditChange = (e?: any) => {
    console.log('onChange');
    if (!this.editor) {
      return;
    }
    this.props.setEditorUnsavedContent(this.editor.innerText);
  }

  async loadText() {
    if (!this.editor) {
      return;
    }
    const text = await remote.text(this.props.currFile.path);
    if (!this.editor) {
      return;
    }
    this.editor.innerText = text;
    this.props.setEditorUnsavedContent(text);
  }

  componentDidMount() {
    this.loadText();
  }

  render() {
    const {editorLayout} = this.props;
    return (
      <div className="markdown-editor"
        ref={ref => this.container = ref}
      >
        <div className="main-area">
          <div
            className={classnames(
              "edit-area",
              editorLayout
            )}
            contentEditable={true}
            ref={ref => this.editor = ref}
            onInput={this.onEditChange}
            onKeyDown={this.onEditKeyDown}
          />
          {this.renderMarkdown()}
        </div>
      </div>
    );
  }

  renderMarkdown() {
    const {currFile, editorLayout, editorTheme, editorUnsavedContent } = this.props;

    return (
      <ReactMarkdown
        className={classnames(
          'preview-area',
          `theme-${editorTheme}`,
          editorLayout
        )}
        plugins={[gfm, math]}
        renderers={{
          break: (a: any) => {
            return <br />;
          },
          code: ({language, value}: any) => {
            value = value.split('\n').map(s => s.trimRight()).join('\n');
            return <SyntaxHighlighter style={codeTheme} language={language} children={value} />;
          },
          image: ({src}: any) => {
            if (src.startsWith('./')) {
              src = remote.resolveRelativePath(currFile.path, src) ;
            }
            return <img src={src} alt=''></img>;
          },
          inlineMath: ({value}) => <InlineMath math={value} />,
          math: ({value}) => <BlockMath math={value} />
        }}
        children={formatTextForPreview(editorUnsavedContent)}
      />
    );
  }
}
