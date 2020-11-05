import React from "react";
import MenuButtonGroup from "./MenuButtonGroup";
import { AppControl } from '../App';
import NavigationBar from './NavigationBar';
import ToggleButton from "./ToggleButton";

interface Props {
  control: AppControl;
  folderPath: string;
  showHiddenFiles: boolean;
}

export default class TopMenubar extends React.PureComponent<Props> {
  
  render() {
    const { folderPath, showHiddenFiles, control } = this.props;
    return (
      <div className="menu">
        <NavigationBar
          path={folderPath}
          control={control}
        />
        <MenuButtonGroup
          btns={['grid', 'list', 'monitor']}
          choices={['grid', 'list', 'gallery']}
          onSelected={control.setLayoutMode}
        />
        <ToggleButton
          on={showHiddenFiles}
          btns={['eye-off', 'eye']}
          onToggle={control.toggleHiddenFiles}
        />
      </div>
    )
  }
}
