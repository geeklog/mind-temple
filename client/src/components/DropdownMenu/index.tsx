import React, { Component } from 'react'

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
        className={className}
        name={name}
        id={id}
        onChange={this.onChange}
      >
        {
          choices.map(choice =>
            <option value={choice}>{choice}</option>
          )
        }
      </select>
    )
  }
}
