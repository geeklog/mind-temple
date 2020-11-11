import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown';
import { FileDesc } from '../../../models/file';
import * as remote from '../../../services/fileService';
import './index.scss';
import { blockWheelWithin, decodeHTMLEntities, encodeHTMLEntities } from '../../../utils/domUtils';
import DropdownMenu from '../../DropdownMenu';
import classnames from 'classnames';
import ToggleButton from '../../ToggleButton';

interface Props {
  file: FileDesc;
}

interface State {
  text: string;
  theme: string;
  previewVisible: boolean;
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
  
  themes = [
    'paper',
    'greenville',
    'github',
    'steampunk',
  ];

  container: HTMLDivElement | null = null;
  editor: HTMLDivElement | null = null;

  state = {
    text: '',
    theme: 'paper',
    previewVisible: true
  };

  onWheel = blockWheelWithin(() => this.container);

  onEditChange = (e?: any) => {
    console.log('onChange');
    if (!this.editor) {
      return;
    }
    this.setState({
      text: formatTextForPreview(this.editor.innerHTML)
    });
  }

  onThemeSelected = (theme: string) => {
    this.setState({theme});
  }

  onTogglePreview = (previewVisible: boolean) => {
    this.setState({previewVisible});
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
    const {file} = this.props;
    const {theme, previewVisible} = this.state;
    return (
      <div className="markdown-editor"
        ref={ref => this.container = ref}
        onWheel={this.onWheel}
      >
        <div className="title-bar">
          <span className="file-name">{file.name}</span>
          <div className="menu-group">
            <ToggleButton
              className="toggle-preview"
              on={previewVisible}
              btns={['eye-off', 'eye']}
              onToggle={this.onTogglePreview}
            />
            <DropdownMenu
              className="theme"
              choices={this.themes}
              onSelect={this.onThemeSelected}
            />
          </div>
        </div>
        <div className="main-area">
          <div className={classnames(
            "edit-area",
            (previewVisible ? '' : 'hide')
          )}
            contentEditable={true}
            ref={ref => this.editor = ref}
            onInput={this.onEditChange}
          />
          <ReactMarkdown
            className={classnames(
              'preview-area',
              `theme-${theme}`,
              (previewVisible ? '' : 'hide')
            )}
          >
            {this.state.text}
          </ReactMarkdown>
        </div>
      </div>
    )
  }
}
