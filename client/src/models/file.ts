export interface FileDesc {
  type: 'file' | 'folder' | 'image';
  name: string;
  path: string;
  ext: string;
  subs?: FileDesc[];
}

export interface ImageDesc extends FileDesc {
  width: number;
  height: number;
}