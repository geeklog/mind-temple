import React, { useEffect, useState } from 'react';
import './styles/App.css';
import 'pure-react-carousel/dist/react-carousel.es.css';
import MenuButtonGroup from './components/MenuButtonGroup';
import { apiServer } from './config';
import { FileDesc } from './models/file';
import FilePreviewGridLayout from './components/FilePreviewGridLayout';
import FilePreviewListLayout from './components/FilePreviewListLayout';
import FilePreviewGalleryLayout from './components/FilePreviewGalleryLayout';

interface BrowseResponse {
  ok: 0 | 1;
  message?: string;
  files: FileDesc[];
}

type LayoutMode = 'list' | 'grid' | 'gallery';

function App() {
  console.log('draw app');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('grid');
  const [currIndex, setCurrIndex] = useState(0);
  const [folderPath, setFolderPath] = useState('~/Downloads/imgs');
  const [res, setRes] = useState<BrowseResponse|null>(null);
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderPath(event.target.value);
  };
  
  const callAPI = () => {
    fetch(`${apiServer}/browse/${folderPath}`)
      .then(res => res.json())
      .then(r => setRes(r as any))
      .catch(err => err);
  }

  const onOpen = (index: number, file: FileDesc) => {
    setCurrIndex(index);
    setLayoutMode('gallery');
  }

  useEffect(() => {
    callAPI()
  }, [folderPath])

  return (
    <div className="main">
      <div className="menu">
        <input className="addressbar" type="text" value={folderPath} onChange={onInputChange} />
        <MenuButtonGroup
          btns={['grid', 'list', 'monitor']}
          choices={['grid', 'list', 'gallery']}
          onSelected={(selected) => setLayoutMode(selected as LayoutMode)}
        />
      </div>
      {res?.ok && layoutMode === 'grid' && renderGrid(res.files) }
      {res?.ok && layoutMode === 'list' && renderList(res.files) }
      {res?.ok && layoutMode === 'gallery' && renderGallery(res.files) }
      {res && !res.ok &&
        <div className="error-msg">
          {res.message}
        </div>
      }
    </div>
  );

  function renderGrid(files: FileDesc[]) {
    return (
      <FilePreviewGridLayout
        currSelected={currIndex}
        setCurrSelected={setCurrIndex}
        files={files}
        onOpen={onOpen}
      />
    );
  }

  function renderList(files: FileDesc[]) {
    return (
      <FilePreviewListLayout
        files={files}
        currSelected={currIndex}
        setCurrSelected={setCurrIndex}
        onOpen={onOpen}
      />
    );
  }

  function renderGallery(files: FileDesc[]) {
    return (
      <FilePreviewGalleryLayout
        files={files}
        currSelected={currIndex}
        setCurrSelected={setCurrIndex}
        onOpen={onOpen}
      />
    )
  }
}

export default App;
