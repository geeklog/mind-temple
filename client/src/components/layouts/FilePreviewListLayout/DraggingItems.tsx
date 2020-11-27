import React, { Component } from 'react';
import { FileDesc } from '../../../models/file';

interface Props {
  items: FileDesc[];
}

export default class DraggingItems extends Component<Props> {
  render() {
    const {items} = this.props;
    return (
      <div
        id="dragging-items"
        style={{
          position: 'fixed',
          left: '-1000px',
          padding: '20px',
          display: 'flex',
          alignItems: 'flex-start',
          flexDirection: 'column'
        }}
      >
        {items.map((f, i) =>
          <span
            key={i}
            style={{
              color: 'white',
              background: '#2bb1f6',
              fontSize: '14px',
              padding: '4px 10px',
              marginTop: '1px',
              borderRadius: '50px',
              // border: '#0099e6 solid 1px',
              height: '1.8em',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
              // boxShadow: '0 1px 2px #00aaff'
            }}
          >
            {f?.name}
          </span>
        )}
        {items.length > 1 &&
          <div
            style={{
              color: 'white',
              background: 'red',
              borderRadius: '200px',
              padding: '1px 5px',
            }}
          >
            {items.length}
          </div>
        }
      </div>
    );
  }
}
