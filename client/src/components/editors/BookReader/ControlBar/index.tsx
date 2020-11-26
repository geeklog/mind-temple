import React from "react";
import { AppProps } from '../../../../models/app';
import Button from '../../../controls/Button';
import * as remote from '../../../../services/fileService';
import { formatTextForPreview } from '../../../../utils/markdownUtils';
import './index.scss';
import hotkeys from "../../../../services/hotkeys";

export default class BookReaderControlBar extends React.PureComponent<AppProps> {

  onEditSave = async () => {
    const file = this.props.currFile;
    const unsavedContent = this.props.editorUnsavedContent;
    console.log('Saving...', file);
    this.props.setEditorUnsaved('Saving...');
    if (unsavedContent) {
      await remote.save(file.path, formatTextForPreview(unsavedContent));
    }
    this.props.setEditorUnsaved('Saved');
  }

  componentDidMount() {
    hotkeys.registerCommand('Cmd:SaveCurrFile', () => this.onEditSave());
  }

  componentWillUnmount() {
    hotkeys.unregisterCommand('Cmd:SaveCurrFile');
  }

  render() {
    const { editorSaved } = this.props;

    return (
      <div className="markdown-editor-control-bar">
        <Button
          className="save"
          label={editorSaved}
          onClick={this.onEditSave}
        />
      </div>
    );
  }
}
