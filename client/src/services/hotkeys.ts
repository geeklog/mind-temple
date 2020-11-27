type Action = () => Promise<void> | void;

class HotkeyService {

  ctrlHolding: boolean;
  metaHolding: boolean;
  altHolding: boolean;
  shiftHolding: boolean;

  private cmds: {[cmdName: string]: Action} = {};
  private keybindings: Array<[string[], string]> = [];

  activate() {
    document.addEventListener('keydown', this.onKey);
    document.addEventListener('keydown', this.keyDownCheckHolding);
    document.addEventListener('keyup', this.keyUpCheckHolding);
  }

  deactivate() {
    document.removeEventListener('keydown', this.onKey);
    document.removeEventListener('keydown', this.keyDownCheckHolding);
    document.removeEventListener('keyup', this.keyUpCheckHolding);
  }

  keyDownCheckHolding = (event: KeyboardEvent) => {
    if (event.metaKey) {
      this.metaHolding = true;
    }
    if (event.shiftKey) {
      this.shiftHolding = true;
    }
    if (event.ctrlKey) {
      this.ctrlHolding = true;
    }
    if (event.altKey) {
      this.altHolding = true;
    }
  }

  keyUpCheckHolding = (event: KeyboardEvent) => {
    if (event.key === 'Meta') {
      this.metaHolding = false;
    }
    if (event.key === 'Shift') {
      this.shiftHolding = false;
    }
    if (event.key === 'Ctrl') {
      this.ctrlHolding = false;
    }
    if (event.key === 'Alt') {
      this.altHolding = false;
    }
  }

  onKey = (event: KeyboardEvent) => {
    for (const [keySeq, command] of this.keybindings) {
      this.checkKeybinding(keySeq, command, event);
    }
  }

  checkKeybinding(keySeq: string[], command: string, event: KeyboardEvent) {
    if (!event.shiftKey && !event.metaKey && !event.altKey && !event.ctrlKey) {
      return;
    }
    const action = this.cmds[command];
    if (!action) {
      console.log('!action', command);
      return;
    }
    let key = '';
    let shift = false;
    let meta = false;
    let ctrl = false;
    let alt = false;
    for (const k of keySeq) {
      if (k === 'command' || k === 'cmd') {
        meta = true;
      } else if (k === 'shift') {
        shift = true;
      } else if (k === 'control' || k === 'ctrl') {
        ctrl = true;
      } else if (k === 'alt') {
        alt = true;
      } else {
        key = k;
      }
    }
    if (event.key.toLowerCase() !== key) {
      return;
    }
    if (shift && !event.shiftKey) {
      return;
    }
    if (meta && !event.metaKey) {
      return;
    }
    if (alt && !event.altKey) {
      return;
    }
    if (ctrl && !event.ctrlKey) {
      return;
    }
    event.preventDefault?.();
    event.stopImmediatePropagation?.();
    action();
  }

  addHotkey(keybinding: string, command: string) {
    this.keybindings.push([keybinding.split('+').map(s => s.trim().toLowerCase()), command]);
  }

  registerCommand(command: string, action: any) {
    this.cmds[command] = action;
  }

  unregisterCommand(command: string) {
    delete this.cmds[command];
  }

}

export default new HotkeyService();
