import React, { Component } from 'react'
import './index.scss';
import classnames from 'classnames';

interface Props {
  choices: string[];
  className: string;
  name?: string;
  id?: string;
  onSelect?: (value: string) => void;
}

export default class DropdownMenu extends Component<Props> {
  
  onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.props.onSelect?.(event.target.value);
  }
  
  render() {
    const {choices, className, name, id} = this.props;
    return (
      <select
        className={classnames('dropdown-menu', className)}
        name={name}
        id={id}
        onChange={this.onChange}
      >
        {
          choices.map(choice =>
            <option
              key={choice}
              value={choice}
            >
              {choice}
            </option>
          )
        }
      </select>
    )
  }
}
