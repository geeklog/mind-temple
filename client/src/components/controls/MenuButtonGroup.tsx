import React from 'react';
import { LayoutMode } from '../../models/layout';
import Icon from './Icon';
import deepEquals from 'deep-equal';

interface Props {
  btns: string[];
  choices: string[];
  onSelected: (selected: LayoutMode) => void;
}

class MenuButtonGroup extends React.Component<Props> {

  shouldComponentUpdate(prevProps: Props, prevState) {
    return !deepEquals(prevProps, this.props);
  }

  render() {
    const {btns, choices, onSelected} = this.props;
    return (
      <>
        {btns.map((btnName, i) =>
          <Icon
            key={i}
            name={btnName}
            className="menu-icon"
            onClick={() => onSelected(choices[i] as LayoutMode)
          }/>
        )}
      </>
    );
  }
}

export default MenuButtonGroup;
