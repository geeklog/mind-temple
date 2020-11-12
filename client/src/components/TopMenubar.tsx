import React from "react";
import MenuButtonGroup from "./controls/MenuButtonGroup";
import NavigationBar from './NavigationBar';
import ToggleButton from "./controls/ToggleButton";
import { AppProps, connectAppControl } from '../models/app';

class TopMenubar extends React.PureComponent<AppProps> {
  render() {
    const { currPath, showHiddenFiles, setLayoutMode, toggleHiddenFiles } = this.props;
    return (
      <div className="menu">
        <NavigationBar
          path={currPath}
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
      </div>
    );
  }
}

export default connectAppControl(TopMenubar);
