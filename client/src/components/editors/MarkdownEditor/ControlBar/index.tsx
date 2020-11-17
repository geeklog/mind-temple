import React from "react";
import { AppProps } from '../../../../models/app';
import Button from '../../../controls/Button';
import DropdownMenu from '../../../controls/DropdownMenu';
import ToggleButton from '../../../controls/ToggleButton';
import * as remote from '../../../../services/fileService';
import { formatTextForPreview } from '../../../../utils/markdownUtils';
import './index.scss';

export default class MarkdownEditorControlBar extends React.PureComponent<AppProps> {

  themes = [
    'paper',
    'greenville',
    'github',
    'steampunk',
  ];

  onEditSave = async () => {
    const file = this.props.currFile;
    const unsavedContent = this.props.editorUnsavedContent;
    this.props.setEditorUnsaved('Saving...');
    if (unsavedContent) {
      await remote.save(file.path, formatTextForPreview(unsavedContent));
    }
    this.props.setEditorUnsaved('Saved');
  }

  onThemeSelected = (theme: string) => {
    this.props.setEditorTheme(theme);
  }

  onTogglePreview = (previewVisible: boolean) => {
    this.setState({previewVisible});
  }

  render() {
    const {
      editorLayout,
      editorSaved,
      setEditorLayout: toggleEditorLayout,
    } = this.props;

    return (
      <div className="markdown-editor-control-bar">
        <Button
          className="save"
          label={editorSaved}
          onClick={this.onEditSave}
        />
        <DropdownMenu
          className="theme"
          choices={this.themes}
          onSelect={this.onThemeSelected}
        />
        <ToggleButton
          className="editor-layout"
          on={editorLayout}
          btns={['file-text', 'book', 'columns']}
          values={['edit', 'preview', 'both']}
          toggleOnMouseOver={true}
          onToggle={toggleEditorLayout}
        />
      </div>
    );
  }
}
