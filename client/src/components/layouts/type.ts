import { FileDesc } from "../../models/file";

export interface FileItemProps {
  file: FileDesc;
  selected: boolean;
  dragging: boolean;
  dropping: boolean;
  index: number;
  onClick?: (file: FileDesc, index: number) => void;
  onDoubleClick?: (file: FileDesc, index: number) => void;
  onContextMenu?: (options: ContextMenuOptions) => void;
  onDragStart: (file: FileDesc, index: number, event: React.DragEvent<HTMLLIElement>) => void;
  onDragLeave: (file: FileDesc, index: number, event: React.DragEvent<HTMLLIElement>) => void;
  onDragEnter: (file: FileDesc, index: number, event: React.DragEvent<HTMLLIElement>) => void;
  onDragOver: (file: FileDesc, index: number, event: React.DragEvent<HTMLLIElement>) => void;
  onDragEnd: (file: FileDesc, index: number, event: React.DragEvent<HTMLLIElement>) => void;
  onDrop: (file: FileDesc, index: number) => void;
}

export interface ContextMenuOptions {
  visible: boolean;
  x: number;
  y: number;
  index: number;
  file: FileDesc;
}
