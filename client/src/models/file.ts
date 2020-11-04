export interface FileDesc {
  name: string;
  path: string;
  ext: string;
}

export interface ImageDesc extends FileDesc {
  width: number;
  height: number;
}