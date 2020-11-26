window.onload = () => {
  parent.postMessage({ type: 'loaded' }, '*');
};

window.addEventListener('keydown', (event) => {
  const evt = {
    type: 'keydown',
    key: event.key,
    code: event.code,
    location: event.location,
    altKey: event.altKey,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    shiftKey: event.shiftKey,
    key: event.key,
    repeat: event.repeat,
    isComposing: event.isComposing,
  };
  parent.postMessage(evt, '*');
});

window.addEventListener('scroll', (event) => {
  parent.postMessage({
    type: 'scroll',
    x: window.pageXOffset,
    y: window.pageYOffset,
  }, '*');
});

window.addEventListener('message', event => {
  if (event.data.eventName === 'Evt:UpdateVar') {
    // tslint:disable-next-line: forin
    for (const varKey in event.data.params) {
      const varValue = event.data.params[varKey];
      document.documentElement.style.setProperty(varKey, varValue);
      if (varKey === '--theme') {
        document.body.className = '';
        document.body.classList.add(`theme-${varValue}`);
      }
    }
    return;
  }
  if (event.data.eventName === 'Evt:UpdateScrollTop') {
    window.scrollTo(0, event.data.params);
  }
});
