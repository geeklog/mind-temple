import React, { Component } from 'react';
import classnames from 'classnames';
import { splitAt } from '../../../utils/strUtils';

interface Props {
  className: string;
}

interface Chunk {
  loaded: boolean;
  text: string;
}

export default class LazyDiv extends Component<Props> {

  div: HTMLDivElement;
  chunks: Chunk[] = [];
  loadedCount = 0;

  onScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const self = event.target as any;
    if (self.scrollHeight - self.scrollTop === self.clientHeight) {
      console.log('onScrollEnd');
      this.chunks[this.loadedCount].loaded = true;
      this.loadedCount++;
      this.forceUpdate();
    }
  }

  setContent(content: string) {
    this.chunks = splitAt(content, 5000).map(text => ({text, loaded: false}));
    this.chunks[this.loadedCount].loaded = true;
    this.loadedCount++;
    this.forceUpdate();
  }

  render() {
    const {className} = this.props;
    return (
      <div
        className={classnames(
          className
        )}
        ref={ref => this.div = ref}
        onScroll={this.onScroll}
      >
        {this.chunks.map(({text, loaded}, i) =>
          <p key={i} dangerouslySetInnerHTML={{
            __html: loaded ? text : ''
          }}/>
        )}
      </div>
    );
  }
}
