import { FileDesc } from "../../models/file";

export interface FileItemProps {
  color?: string;
  file: FileDesc;
  selected: boolean;
  dragging: boolean;
  dropping: boolean;
  index: number;
  className?: string | string[];
  onClick?: (file: FileDesc, index: number) => void;
  onDoubleClick?: (file: FileDesc, index: number) => void;
  onContextMenu?: (options: ContextMenuOptions) => void;
  onDragStart?: (file: FileDesc, index: number, event: React.DragEvent<HTMLElement>) => void;
  onDragLeave?: (file: FileDesc, index: number, event: React.DragEvent<HTMLElement>) => void;
  onDragEnter?: (file: FileDesc, index: number, event: React.DragEvent<HTMLElement>) => void;
  onDragOver?: (file: FileDesc, index: number, event: React.DragEvent<HTMLElement>) => void;
  onDragEnd?: (file: FileDesc, index: number, event: React.DragEvent<HTMLElement>) => void;
  onDrop?: (file: FileDesc, index: number) => void;
}

export interface ContextMenuOptions {
  visible: boolean;
  x: number;
  y: number;
  index: number;
  file: FileDesc;
}
