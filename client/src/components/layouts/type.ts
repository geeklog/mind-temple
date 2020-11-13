import { FileDesc } from "../../models/file";

export interface FileItemProps {
  file: FileDesc;
  selected: boolean;
  index: number;
  onClick?: (index: number, file: FileDesc) => void;
  onDoubleClick?: (index: number, file: FileDesc) => void;
  onContextMenu?: (options: ContextMenuOptions) => void;
}

export interface ContextMenuOptions {
  visible: boolean;
  x: number;
  y: number;
  index: number;
  file: FileDesc;
}
