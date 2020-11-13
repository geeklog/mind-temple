import { FileDesc } from "../../models/file";

export interface FileItemProps {
  file: FileDesc;
  selected: boolean;
  index: number;
  onClick?: (file: FileDesc, index: number) => void;
  onDoubleClick?: (file: FileDesc, index: number) => void;
  onContextMenu?: (options: ContextMenuOptions) => void;
}

export interface ContextMenuOptions {
  visible: boolean;
  x: number;
  y: number;
  index: number;
  file: FileDesc;
}
