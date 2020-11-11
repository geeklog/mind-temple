import React from 'react';
import { LayoutMode } from '../../models/layout';
import Icon from './Icon';

interface Props {
  btns: string[];
  choices: string[];
  onSelected: (selected: LayoutMode) => void;
}

function MenuButtonGroup({btns, choices, onSelected}: Props) {
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
  )
}

export default MenuButtonGroup;
