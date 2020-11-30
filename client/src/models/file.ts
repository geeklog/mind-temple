export interface BrowseResponse {
  ok: 0 | 1;
  error?: string;
  file: FileDesc;
}

export interface FileDesc {
  type: 'file' | 'folder' | 'image' | 'text' | 'markdown';
  name: string;
  path: string;
  ext: string;
  subs?: FileDesc[];
  atime: Date;
  ctime: Date;
  mtime: Date;
  size: number;
}

export interface ImageDesc extends FileDesc {
  width: number;
  height: number;
}
