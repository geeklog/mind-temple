import React, { useEffect, useState } from 'react';
import './App.css';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, Image, DotGroup } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import MenuButtonGroup from './components/MenuButtonGroup';
import { apiServer } from './config';
import { FileDesc } from './models/file';
import FilePreviewGridLayout from './components/FilePreviewGridLayout';

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
      <div className="files-layout-list">
        {files.map(({name, path}) =>
          <li key={path}>
            <span className="thumb">
              <img src={`${apiServer}/thumb/${path}?w=100`}></img>
            </span>
            <span>
              {name}
            </span>
          </li>
        )}
      </div>
    );
  }

  function renderGallery(files: FileDesc[]) {
    return (
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={100}
        totalSlides={files.length}
        infinite={true}
        currentSlide={currIndex}
      >
        <Slider classNameAnimation={"slide-animation"}>
          {
            files.map(({name, path}, i) =>
              <Slide key={i} index={i} style={{
                paddingBottom: 'calc(90vh - 25px)'
              }}>
                <Image
                  key={i}
                  className="image"
                  hasMasterSpinner={false}
                  src={`${apiServer}/file/${path}`}
                  alt={name}
                />
              </Slide>
            )
          }
        </Slider>
        <div className="control-group">
          <ButtonBack className="btn-back">&#x3C;</ButtonBack>
          <DotGroup dotNumbers={false}/>
          <ButtonNext className="btn-next">&#x3E;</ButtonNext>
        </div>
      </CarouselProvider>
    )
  }
}

export default App;
