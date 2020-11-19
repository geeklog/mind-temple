import React from "react";
import NavigationBar from '../NavigationBar';
import ToggleButton from "../controls/ToggleButton";
import { AppProps, connectAppControl } from '../../models/app';
import './index.scss';
import Button from "../controls/Button";
import MarkdownEditorControlBar from '../editors/MarkdownEditor/ControlBar';
import FolderControlBar from "../layouts/FolderControlBar";
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
  }

  render() {
    const {
      currPath,
      currFile,
    } = this.props;
    const isFolder = currFile.file && currFile.file.type === 'folder';
    const isMarkdown = currFile.file && currFile.file.type === 'markdown';
    return (
      <div className="menu">
        <ToggleButton
          className="sidebar-btn dim"
          on={this.props.sidebarOpened}
          btns={['chevrons-right', 'chevrons-left']}
          onToggle={this.props.toggleSidebar}
        />
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
        <ToggleButton
          className="rightpane-btn dim"
          on={this.props.rightPaneOpened}
          btns={['chevrons-left', 'chevrons-right']}
          onToggle={this.props.toggleRightPane}
        />
      </div>
    );
  }
}

export default connectAppControl(TopMenubar);
