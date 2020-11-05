export interface FileDesc {
  type: 'file' | 'folder' | 'image';
  name: string;
  path: string;
  ext: string;
}

export interface ImageDesc extends FileDesc {
  width: number;
  height: number;
}