import hotkeys from "./services/hotkeys";

export const apiServer = 'http://localhost:9000';

export function setupKeybindings() {
  hotkeys.addHotkey('Cmd+Backspace', 'Cmd:TrashCurrFile');
  hotkeys.addHotkey('Cmd+\\', 'Cmd:ToggleSideBar');
  hotkeys.addHotkey('Cmd+m', 'Cmd:ToggleTopbar');
  hotkeys.addHotkey('Cmd+S', 'Cmd:SaveCurrFile');
  hotkeys.activate();
}
