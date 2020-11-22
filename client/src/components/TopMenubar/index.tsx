import React from "react";
import NavigationBar from '../NavigationBar';
import ToggleButton from "../controls/ToggleButton";
import { AppProps, connectAppControl } from '../../models/app';
import './index.scss';
import Button from "../controls/Button";
import MarkdownEditorControlBar from '../editors/MarkdownEditor/ControlBar';
import FolderControlBar from "../layouts/FolderControlBar";
import classnames from 'classnames';
import hotkeys from "../../services/hotkeys";
class TopMenubar extends React.PureComponent<AppProps> {

  onPathChanged = (currPath: string) => {
    this.props.navigateTo(currPath);
  }

  toggleNightMode = (b: boolean) => {
    document.documentElement.className = '';
    document.documentElement.classList.add(`theme-${b ? 'light' : 'dark'}`);
    this.props.setTheme(b ? 'light' : 'dark');
  }

  componentDidMount() {
    document.documentElement.className = '';
    document.documentElement.classList.add(`theme-${this.props.theme}`);
    hotkeys.registerCommand('Cmd:ToggleTopbar', this.props.toggleTopbar);
  }
  
  componentWillUnmount() {
    hotkeys.unregisterCommand('Cmd:ToggleTopbar');
  }

  componentDidUpdate() {
    let root = document.documentElement;
    if (this.props.topbarOpened) {
      root.style.setProperty('--topbar-height', '45px');
    } else {
      root.style.setProperty('--topbar-height', '0px');
    }
  }

  render() {
    const {
      currPath,
      currFile,
    } = this.props;
    const isFolder = currFile.file && currFile.file.type === 'folder';
    const isMarkdown = currFile.file && currFile.file.type === 'markdown';
    return (
      <div
        className={classnames(
          "menu",
          this.props.topbarOpened ? '' : 'hide'
        )}
      >
        <Button
          icon="arrow-left"
          disabled={!this.props.canNavigateBackward}
          onClick={this.props.navigateBackward}
        />
        <Button
          icon="arrow-right"
          disabled={!this.props.canNavigateForward}
          onClick={this.props.navigateForward}
        />
        <NavigationBar
          currPath={currPath}
          onPathChanged={this.onPathChanged}
        />
        {isFolder &&
          <FolderControlBar {...this.props} />
        }
        {isMarkdown &&
          <MarkdownEditorControlBar {...this.props} />
        }
        <ToggleButton
          on={this.props.theme === 'light'}
          btns={['moon', 'sun']}
          onToggle={this.toggleNightMode}
          toggleOnMouseOver={true}
        />
      </div>
    );
  }
}

export default connectAppControl(TopMenubar);
