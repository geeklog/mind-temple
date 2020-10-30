import React from 'react';
import Icon from './Icon';

interface Props {
  btns: string[];
  choices: string[];
  onSelected: (selected: string) => void;
}

function MenuButtonGroup({btns, choices, onSelected}: Props) {
  return (
    <div>
      {btns.map((btnName, i) =>
        <Icon
          key={i}
          name={btnName}
          className="menu-icon"
          onClick={() => onSelected(choices[i])
        }/>
      )}
    </div>
  )
}

export default MenuButtonGroup;
