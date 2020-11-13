import React from "react";
import MenuButtonGroup from "./controls/MenuButtonGroup";
import NavigationBar from './NavigationBar';
import ToggleButton from "./controls/ToggleButton";
import { AppProps, connectAppControl } from '../models/app';

class TopMenubar extends React.PureComponent<AppProps> {

  onPathChanged = (currPath: string) => {
    this.props.browse(currPath);
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
