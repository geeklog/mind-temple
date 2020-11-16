import React from "react";
import MenuButtonGroup from "../controls/MenuButtonGroup";
import NavigationBar from '../NavigationBar';
import ToggleButton from "../controls/ToggleButton";
import { AppProps, connectAppControl } from '../../models/app';
import './index.scss';
import Button from "../controls/Button";

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
    const { currPath, showHiddenFiles, setLayoutMode, toggleHiddenFiles } = this.props;
    return (
      <div className="menu">
        <ToggleButton
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
        <MenuButtonGroup
          btns={['grid', 'list', 'monitor']}
          choices={['grid', 'list', 'gallery']}
          onSelected={setLayoutMode}
        />
        <ToggleButton
          on={showHiddenFiles}
          btns={['eye-off', 'eye']}
          onToggle={toggleHiddenFiles}
        />
        <ToggleButton
          on={this.props.theme === 'light'}
          btns={['moon', 'sun']}
          onToggle={this.toggleNightMode}
        />
      </div>
    );
  }
}

export default connectAppControl(TopMenubar);
