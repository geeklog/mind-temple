import React, { useEffect, useState } from 'react';
import './App.css';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, Image, DotGroup } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

interface FileDesc {
  name: string;
  path: string;
}

interface BrowseResponse {
  ok: 0 | 1;
  message?: string;
  files: FileDesc[];
}

function App() {
  const [folderPath, setFolderPath] = useState('~/Downloads/imgs');
  const [res, setRes] = useState<BrowseResponse|null>(null);
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderPath(event.target.value);
  };
  const callAPI = () => {
    fetch(`http://localhost:9000/browse/${folderPath}`)
      .then(res => res.json())
      .then(r => setRes(r as any))
      .catch(err => err);
  }
  useEffect(() => {
    callAPI()
  }, [folderPath])

  return (
    <div className="main">
      <input className="addressbar" type="text" value={folderPath} onChange={onInputChange} />
      {res?.ok &&
        <CarouselProvider
          naturalSlideWidth={100}
          naturalSlideHeight={100}
          totalSlides={res.files.length}
          infinite={true}
        >
          <Slider classNameAnimation={"slide-animation"}>
            {
              res.files.map(({name, path}, i) =>
                <Slide index={i} style={{
                  paddingBottom: 'calc(90vh - 5px)'
                }}>
                  <Image
                    className="image"
                    hasMasterSpinner={false}
                    src={'http://localhost:9000' + path}
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
      }
      {res && !res.ok &&
        <p className="ap p-intro">{res.message}</p>
      }
      
    </div>
  )
}

export default App;
