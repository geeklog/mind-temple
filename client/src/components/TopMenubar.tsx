import React from "react";
import MenuButtonGroup from "./MenuButtonGroup";
import { AppControl } from '../App';

interface Props {
  control: AppControl;
  folderPath: string;
}

export default class TopMenubar extends React.PureComponent<Props> {
  
  onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.control.setFolderPath(event.target.value);
  };
  
  render() {
    const { folderPath, control } = this.props;
    return (
      <div className="menu">
        <input
          className="addressbar"
          type="text"
          value={folderPath}
          onChange={this.onInputChange}
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
