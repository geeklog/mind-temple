
type Listener = (eventName: string, params: any) => void;

class EventCenter {

  listeners: {[eventName: string]: Listener[]} = {'*': []};

  dispatchEvent(eventName: string, params: any) {
    let listeners: Listener[];
    this.listeners[eventName] = listeners = this.listeners[eventName] || [];
    for (const listener of listeners) {
      listener(eventName, params);
    }
    for (const listener of this.listeners['*']) {
      listener(eventName, params);
    }
  }

  listenTo(eventName: string, listener: Listener) {
    let listeners: Listener[];
    this.listeners[eventName] = listeners = this.listeners[eventName] || [];
    listeners.push(listener);
  }

  deafTo(eventName: string, listener: Listener) {
    let listeners: Listener[];
    this.listeners[eventName] = listeners = this.listeners[eventName] || [];
    listeners.splice(listeners.indexOf(listener), 1);
  }

}

export default new EventCenter();
