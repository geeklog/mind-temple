import hotkeys from "./services/hotkeys";

export const apiServer = 'http://localhost:9000';

export function setupKeybindings() {
  hotkeys.addHotkey('Cmd+Backspace', 'Cmd:TrashCurrFile');
  hotkeys.activate();
}
