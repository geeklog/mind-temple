import React from "react";
import MenuButtonGroup from "./MenuButtonGroup";
import { AppControl } from '../App';
import NavigationBar from './NavigationBar';

interface Props {
  control: AppControl;
  folderPath: string;
}

export default class TopMenubar extends React.PureComponent<Props> {
  
  render() {
    const { folderPath, control } = this.props;
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
      </div>
    )
  }
}
