import React, { PureComponent } from 'react';
import eventCenter from '../../../services/eventCenter';

interface Props {
  src: string;
  title: string;
  className?: string;
  scrollTop?: number;
  onScroll?: (x: number, y: number) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onLoaded?: () => void;
}

export default class IFrame extends PureComponent<Props> {

  iframe: HTMLIFrameElement;

  postMessage(msg: any) {
    this.iframe.contentWindow.postMessage(msg, '*');
  }

  onIFrameMessage = (event: MessageEvent) => {
    const {onKeyDown, onScroll, onLoaded} = this.props;
    if (event.data.type === 'keydown') {
      onKeyDown?.(event.data);
      return;
    }
    if (event.data.type === 'scroll') {
      onScroll?.(event.data.x, event.data.y);
    }
    if (event.data.type === 'loaded') {
      console.log('iframe loaded');
      this.iframe?.contentWindow.postMessage({
        eventName: 'Evt:UpdateScrollTop',
        params: this.props.scrollTop
      }, '*');
      onLoaded?.();
    }
  }

  onEvent = (eventName: string, params: any) => {
    this.iframe?.contentWindow.postMessage({eventName, params}, '*');
  }

  componentDidMount() {
    console.log('iframe mounted');
    eventCenter.listenTo('*', this.onEvent);
    window.addEventListener('message', this.onIFrameMessage);
  }

  componentWillUnmount() {
    console.log('iframe unmounted');
    window.removeEventListener('message', this.onIFrameMessage);
    eventCenter.deafTo('*', this.onEvent);
  }

  componentDidUpdate(prevProps: Props) {
    // if (prevProps.scrollTop !== this.props.scrollTop) {
      this.iframe?.contentWindow.postMessage({
        eventName: 'Evt:UpdateScrollTop',
        params: this.props.scrollTop
      }, '*');
    // }
  }

  render() {
    const {src, title, className} = this.props;
    return (
      <iframe
        ref={(ref) => this.iframe = ref}
        src={src}
        title={title}
        className={className}
      />
    );
  }
}
