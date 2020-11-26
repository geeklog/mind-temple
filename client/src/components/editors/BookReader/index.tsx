import React, { Component } from 'react';
import * as remote from '../../../services/fileService';
import './index.scss';
import { AppProps } from '../../../models/app';
import classnames from 'classnames';
import IFrame from '../../controls/IFrame';
import hotkeys from '../../../services/hotkeys';

interface State {
  content: string;
  scrollTop: number;
}

export default class BookReader extends Component<AppProps, State> {
  previewLight: IFrame;

  state = {
    content: '?',
    scrollTop: 0
  };

  onEditChange = (e?: any) => {
    // console.log('onChange');
    // if (!this.preview) {
    //   return;
    // }
    // this.props.setEditorUnsavedContent(this.preview.innerText);
  }

  async load() {
    let text = await remote.text(this.props.currFile.path);
    text = text.replace(/\n/g, '<br>');
    this.props.setEditorUnsavedContent(text);
    return text;
  }

  async loadSSR() {
    let html = await remote.loadSSRBookContent(this.props.currFile.path);
    return html;
  }

  onBookScroll = (x: number, y: number) => {
    this.setState({
      scrollTop: y
    });
  }

  onBookKeyDown = (event: KeyboardEvent) => {
    console.log('onBookKeyDown', event);
    hotkeys.onKey(event);
  }

  render() {
    const {theme} = this.props;
    const {scrollTop} = this.state;
    return <IFrame
      ref={(ref) => (this.previewLight = ref)}
      className={classnames('book-reader')}
      title={this.props.currFile.path}
      scrollTop={scrollTop}
      src={`${remote.getSSRBookSrc(this.props.currFile.path)}?theme=${theme}`}
      onScroll={this.onBookScroll}
      onKeyDown={this.onBookKeyDown}
    />;
  }
}
